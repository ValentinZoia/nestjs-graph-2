import { HttpException, Injectable } from '@nestjs/common';
import { SignUpInput } from '../dto/signup.input';
import { UpdateAuthInput } from '../dto/update-auth.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAuthEntity } from '../entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignResponse } from '../dto/sign-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(user: SignUpInput): Promise<SignResponse> {
    try {
      //1 Verificar que no exsitan usuarios con el mismo email/username
      const findUser = await this.prisma.user.findUnique({
        where: {
          name_email: {
            name: user.name,
            email: user.email,
          },
        },
      });
      if (findUser) {
        throw new HttpException('User already exists', 400);
      }

      // 2 -  hash password
      user.password = await argon.hash(user.password);

      // 3 - Guardar el usuario
      const createdUser = await this.prisma.user.create({
        data: user,
      });

      const { accessToken, refreshToken } = await this.createTokens(
        createdUser.id,
        createdUser.email,
      );

      await this.updateRefreshToken(createdUser.id, refreshToken);
      const { password, ...userResult } = createdUser;

      return {
        accessToken,
        refreshToken,
        user: userResult,
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAll(): Promise<UserAuthEntity[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number): Promise<UserAuthEntity> {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!findUser) {
        throw new HttpException('User not found', 404);
      }

      return findUser;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async update(
    id: number,
    updateAuthInput: UpdateAuthInput,
  ): Promise<UserAuthEntity> {
    try {
      // Extraer id del input y quedarse solo con los campos actualizables
      const { id: inputId, ...dataToUpdate } = updateAuthInput;

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });
      return updatedUser;
    } catch (error) {
      // Prisma lanza PrismaClientKnownRequestError si el registro no existe
      if (error.code === 'P2025') {
        throw new HttpException('User not found', 404);
      }
      throw new HttpException(error.message, 500);
    }
  }

  async remove(id: number): Promise<Boolean> {
    try {
      return (await this.prisma.user.delete({ where: { id } })) ? true : false;
    } catch (error) {
      // Prisma lanza PrismaClientKnownRequestError si el registro no existe
      if (error.code === 'P2025') {
        throw new HttpException('User not found', 404);
      }
      throw new HttpException(error.message, 500);
    }
  }

  async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        email: email,
      },
      {
        expiresIn: '10s',
        secret: this.configService.get('ACCESS_JWT_SECRET'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: userId,
        email: email,
        accessToken: accessToken,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_JWT_SECRET'),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
