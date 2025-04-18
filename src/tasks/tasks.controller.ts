import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Task } from '../schema';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { TaskEntity } from './entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: TaskEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID for authorization',
    required: true,
  })
  @ApiHeader({
    name: 'x-user-role',
    description: 'User role for authorization',
    required: true,
  })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks or filter by assigned user' })
  @ApiResponse({
    status: 200,
    description: 'Return all tasks or filtered tasks',
    type: [TaskEntity],
  })
  @ApiQuery({
    name: 'assignedUserId',
    required: false,
    description: 'Filter tasks by assigned user ID',
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID for authorization',
    required: true,
  })
  @ApiHeader({
    name: 'x-user-role',
    description: 'User role for authorization',
    required: true,
  })
  async findAll(
    @Query('assignedUserId') assignedUserId?: string,
  ): Promise<Task[]> {
    return this.tasksService.findAll(assignedUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the task with the specified ID',
    type: TaskEntity,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID for authorization',
    required: true,
  })
  @ApiHeader({
    name: 'x-user-role',
    description: 'User role for authorization',
    required: true,
  })
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
    type: TaskEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID for authorization',
    required: true,
  })
  @ApiHeader({
    name: 'x-user-role',
    description: 'User role for authorization',
    required: true,
  })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task (admin only)' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 204,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin access required',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID for authorization (must be an admin)',
    required: true,
  })
  @ApiHeader({
    name: 'x-user-role',
    description: 'User role (must be "admin")',
    required: true,
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
