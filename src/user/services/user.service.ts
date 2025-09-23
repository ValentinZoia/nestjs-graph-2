import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from '../dtos/create-user.input';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async create(user: CreateUserInput): Promise<UserEntity> {
    try {
      return await this.prisma.user.create({
        data: user,
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
