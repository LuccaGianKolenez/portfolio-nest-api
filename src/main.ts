import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Portfolio Nest API')
    .setDescription('NestJS + Prisma + PostgreSQL + Swagger + class-validator')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, { customSiteTitle: 'Portfolio Nest API' });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 Server: http://localhost:${port}/api`);
  // eslint-disable-next-line no-console
  console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
