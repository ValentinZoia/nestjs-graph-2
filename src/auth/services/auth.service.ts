import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { SignUpInput } from '../dto/signup.input';
import { UpdateAuthInput } from '../dto/update-auth.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAuthEntity } from '../entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignResponse } from '../dto/sign-response';
import { LogInInput } from '../dto/login.input';
import { LogoutResponse } from '../dto/logout-response';
import { NewTokensResponse } from '../dto/newTokensResponse';
import { JwtPayload } from '../types';

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
      const findUserByEmail = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (findUserByEmail) {
        throw new HttpException('User already exists', 400);
      }

      const findUserByUsername = await this.prisma.user.findUnique({
        where: {
          name: user.name,
        },
      });
      if (findUserByUsername) {
        throw new HttpException('User already exists', 400);
      }

      // 2 -  hash password
      user.password = await argon.hash(user.password);

      // 3 - Guardar el usuario
      const createdUser = await this.prisma.user.create({
        data: user,
      });

      // 4 - Generar el token
      const { accessToken, refreshToken } = await this.createTokens(
        createdUser.id,
        createdUser.email,
      );

      // 5 - Guardar el refresh token
      await this.updateRefreshToken(createdUser.id, refreshToken);

      // 6 - Quitar password para la respuesta
      const { password, ...userResult } = createdUser;

      // 7 - Devolver el token y usuario
      return {
        accessToken,
        refreshToken,
        user: userResult,
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async login(credentials: LogInInput): Promise<SignResponse> {
    try {
      // 1. Verificar que exista un usuario con ese email
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: credentials.email,
        },
      });

      if (!existingUser) {
        throw new ForbiddenException('Credentials not valid');
      }

      // 2 - Comparar las contraseñas
      const isPasswordValid = await argon.verify(
        existingUser.password,
        credentials.password,
      );

      if (!isPasswordValid) {
        throw new ForbiddenException('Credentials not valid');
      }

      // 3 - Generar el token
      const { accessToken, refreshToken } = await this.createTokens(
        existingUser.id,
        existingUser.email,
      );

      // 4 - Guardar el refresh token
      await this.updateRefreshToken(existingUser.id, refreshToken);

      // 5 - Quitar password para la respuesta
      const { password, ...userResult } = existingUser;

      // 6 - Devolver el token y usuario
      return {
        accessToken,
        refreshToken,
        user: userResult,
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async logout(userId: number): Promise<LogoutResponse> {
    try {
      await this.prisma.user.updateMany({
        where: {
          id: userId,
          refreshToken: { not: null }, // solo si hay un refresh token
        },
        data: { refreshToken: null },
      });

      return { loggedOut: true };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        email: email,
      } as JwtPayload,
      {
        expiresIn: '3h',
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

  async getNewTokens(userId: number, rt: string): Promise<NewTokensResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access Denied');
      const rtMatches = await argon.verify(user.refreshToken, rt);
      if (!rtMatches) throw new ForbiddenException('Access Denied');

      const { accessToken, refreshToken } = await this.createTokens(
        user.id,
        user.email,
      );
      await this.updateRefreshToken(user.id, refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
