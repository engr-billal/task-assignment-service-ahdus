import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { db } from '../db';
import { tasks, Task, NewTask } from '../schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';
import { eq } from 'drizzle-orm';
import { EventPublisherService } from '../common/events/event-publisher.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // If assignedUserId is provided, check if user exists
    if (createTaskDto.assignedUserId) {
      const userExists = await this.usersService.checkUserExists(
        createTaskDto.assignedUserId,
      );
      if (!userExists) {
        throw new BadRequestException(
          `User with ID ${createTaskDto.assignedUserId} does not exist`,
        );
      }
    }

    // Create the task
    const newTask: NewTask = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      assignedUserId: createTaskDto.assignedUserId,
      status: 'pending',
    };

    const result = await db.insert(tasks).values(newTask).returning();
    const createdTask = result[0];

    // Publish task created event
    await this.eventPublisher.publishTaskCreated(createdTask.id, createdTask);

    // If task is assigned, publish task assigned event
    if (createdTask.assignedUserId) {
      await this.eventPublisher.publishTaskAssigned(
        createdTask.id,
        createdTask.assignedUserId,
        createdTask,
      );
    }

    return createdTask;
  }

  async findAll(assignedUserId?: string): Promise<Task[]> {
    // If assignedUserId is provided, filter tasks by it
    if (assignedUserId) {
      return db
        .select()
        .from(tasks)
        .where(eq(tasks.assignedUserId, assignedUserId));
    }
    // Otherwise, return all tasks
    return db.select().from(tasks);
  }

  async findOne(id: string): Promise<Task> {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);

    if (result.length === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return result[0];
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // Check if task exists
    const existingTask = await this.findOne(id);

    // If assignedUserId is provided, check if user exists
    if (updateTaskDto.assignedUserId) {
      const userExists = await this.usersService.checkUserExists(
        updateTaskDto.assignedUserId,
      );
      if (!userExists) {
        throw new BadRequestException(
          `User with ID ${updateTaskDto.assignedUserId} does not exist`,
        );
      }
    }

    // Update the task
    const result = await db
      .update(tasks)
      .set(updateTaskDto)
      .where(eq(tasks.id, id))
      .returning();

    const updatedTask = result[0];

    // Publish task updated event
    await this.eventPublisher.publishTaskUpdated(updatedTask.id, updatedTask);

    // If assignment changed, publish task assigned event
    if (
      updateTaskDto.assignedUserId &&
      existingTask.assignedUserId !== updateTaskDto.assignedUserId
    ) {
      await this.eventPublisher.publishTaskAssigned(
        updatedTask.id,
        updatedTask.assignedUserId,
        updatedTask,
      );
    }

    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    // Check if task exists
    await this.findOne(id);

    // Delete the task
    await db.delete(tasks).where(eq(tasks.id, id));

    // Publish task deleted event
    await this.eventPublisher.publishTaskDeleted(id);
  }
}
