import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), //code first
      playground: false, //para usar apollo sandbox
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // activar el nuevo landing page
    }),
    UserModule,
    AuthModule,
  ],
  providers: [
    PrismaService,
    { provide: APP_GUARD, useClass: AccessTokenGuard }, // para usar el guard en todos los controladores/resolvers
  ],
})
export class AppModule {}
