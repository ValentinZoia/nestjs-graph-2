import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello() {
    return await this.prisma.user.findMany();
  }
  async create() {
    const createdUser = await this.prisma.user.create({
      data: {
        name: 'test',
        email: 'test',
        password: 'test',
      },
    });

    return createdUser;
  }
}
