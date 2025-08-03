import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    const dataSource = app.get(DataSource);
    
    if (!dataSource.isInitialized) {
      logger.error('Database connection is not initialized');
      process.exit(1);
    }

    logger.log('Database connection is active');

    await app.listen(process.env.PORT ?? 3000);
    logger.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
  } catch (error) {
    logger.error('Failed to start application');
    logger.error(error.message);
    process.exit(1);
  }
}

bootstrap();
