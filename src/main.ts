import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  app.enableCors({
    allowedHeaders: ['content-type', 'auth-token'],
    origin: ['https://nextjs-quiz-app-seven.vercel.app'],
    methods: ['POST', 'PUT', 'DELETE', 'GET']
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
