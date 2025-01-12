import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './constant/swagger-options';
import * as fs from 'node:fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useLogger(app.get(Logger));

  generateSwagger(app);
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port: number = app.get(ConfigService).get('port') || 3000;
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(port);
}
function generateSwagger(app: INestApplication) {
  const document: any = SwaggerModule.createDocument(app, swaggerOptions);
  fs.writeFileSync('./swagger/swagger.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('docs', app, document);
}
bootstrap();
