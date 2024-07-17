import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as process from "process"
dotenv.config();

async function bootstrap() {
  const port = process.env.PORT || 4000
  console.log(`Launching NestJS app on port ${port}, URL: http://0.0.0.0:${port}`,123321)
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(port);
}
bootstrap();
