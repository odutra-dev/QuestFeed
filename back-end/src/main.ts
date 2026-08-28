import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const config = new DocumentBuilder()
    .setTitle('QuestFeed')
    .setDescription('Quest Feed is API for Social Games')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new StandardSchemaValidationPipe({
      validateCustomDecorators: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
