import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useRequestLogging } from './middleware/request-logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation
  app.useGlobalPipes(new ValidationPipe());

  useRequestLogging(app);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Taskify API')
    .setDescription('Task Management API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
