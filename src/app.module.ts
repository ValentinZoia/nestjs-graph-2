import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  // imports: [
  //   GraphQLModule.forRoot<ApolloDriverConfig>({
  //     driver: ApolloDriver,
  //     autoSchemaFile: join(process.cwd(), 'src/schema.gql'), //code first
  //     playground: false, //para usar apollo sandbox
  //     plugins: [ApolloServerPluginLandingPageLocalDefault()], // activar el nuevo landing page
  //   }),
  // ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
