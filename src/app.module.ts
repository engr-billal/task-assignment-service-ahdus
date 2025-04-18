import { Module, OnModuleInit } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { pool } from './db';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [TasksModule, UsersModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements OnModuleInit {
  // Lifecycle hook that runs when the module is initialized
  async onModuleInit() {
    try {
      // Test if the connection works
      const result = await pool.query('SELECT NOW()'); // A simple query to check the connection
      console.log('Database connection successful:', result.rows);
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
}
