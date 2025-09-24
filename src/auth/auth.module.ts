import { Module } from '@nestjs/common';
import { AuthResolver } from './resolver/auth.resolver';
import { AuthService } from './services/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accesToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    JwtService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
