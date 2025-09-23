import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //configuracion inicial para manejar dto con class validator
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: { enableImplicitConversion: true },
      whitelist: true, //remueve todo lo que no esta en los DTOs
      forbidNonWhitelisted: true, //retorna bad request si hay propiedades no requeridas
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('Application running on port ' + process.env.PORT);
}
bootstrap();
