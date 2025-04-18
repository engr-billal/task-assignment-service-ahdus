import { Injectable, Logger } from '@nestjs/common';

export interface TaskEvent {
  eventType: 'task_created' | 'task_updated' | 'task_deleted' | 'task_assigned';
  taskId: string;
  data: any;
  timestamp: string;
}

@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);

  // In a real microservices setup, this would publish to a message broker like RabbitMQ, Kafka, etc.
  async publishTaskEvent(event: TaskEvent): Promise<void> {
    this.logger.log(
      `Publishing event: ${event.eventType} for task: ${event.taskId}`,
    );
    this.logger.log(`Event payload: ${JSON.stringify(event)}`);

    // add a delay so it looks real like
    await new Promise((resolve) => setTimeout(resolve, 200));

    this.logger.log(`Event published successfully`);
  }

  // Helper methods for different event types
  async publishTaskCreated(taskId: string, taskData: any): Promise<void> {
    return this.publishTaskEvent({
      eventType: 'task_created',
      taskId,
      data: taskData,
      timestamp: new Date().toISOString(),
    });
  }

  async publishTaskUpdated(taskId: string, taskData: any): Promise<void> {
    return this.publishTaskEvent({
      eventType: 'task_updated',
      taskId,
      data: taskData,
      timestamp: new Date().toISOString(),
    });
  }

  async publishTaskDeleted(taskId: string): Promise<void> {
    return this.publishTaskEvent({
      eventType: 'task_deleted',
      taskId,
      data: { id: taskId },
      timestamp: new Date().toISOString(),
    });
  }

  async publishTaskAssigned(
    taskId: string,
    userId: string,
    taskData: any,
  ): Promise<void> {
    return this.publishTaskEvent({
      eventType: 'task_assigned',
      taskId,
      data: { ...taskData, assignedUserId: userId },
      timestamp: new Date().toISOString(),
    });
  }
}
