import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  console.log('Starting application...');
  console.log('Node environment:', process.env.NODE_ENV);
  console.log('Database URL exists:', !!process.env.DATABASE_URL);

  try {
    const app = await NestFactory.create(AppModule);
    console.log('Application created successfully');

    // Set global prefix
    app.setGlobalPrefix('api');
    console.log('Global prefix set to /api');

    // Add global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    console.log('Validation pipe configured');

    // Add global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());
    console.log('Exception filter configured');

    // Set up Swagger
    const config = new DocumentBuilder()
      .setTitle('Task Assignment API')
      .setDescription('API for managing tasks and assignments')
      .setVersion('1.0')
      .addTag('tasks')
      .addTag('users')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT token',
          in: 'header',
        },
        'jwt-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    console.log('Swagger documentation set up at /api/docs');

    // Enable CORS
    app.enableCors();
    console.log('CORS enabled');

    // Get port from environment variable (Heroku sets this automatically)
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on port ${port}`);
    console.log(`Swagger documentation available at: /api/docs`);
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}
bootstrap();
