import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['*'],
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Stream Platform Management API')
    .setDescription('API for managing streaming channels')
    .setVersion('1.0')
    .addTag('channels')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(config.get<number>('server.port'), () => {
    console.log(`Server is running on port ${config.get<number>('server.port')}`);
  });
}
bootstrap();
