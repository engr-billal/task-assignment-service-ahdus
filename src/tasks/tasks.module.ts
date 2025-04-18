import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';
import { EventPublisherService } from '../common/events/event-publisher.service';

@Module({
  imports: [UsersModule],
  controllers: [TasksController],
  providers: [TasksService, EventPublisherService],
})
export class TasksModule {}
