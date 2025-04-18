import { ApiProperty } from '@nestjs/swagger';

export class TaskEntity {
  @ApiProperty({
    description: 'Unique identifier for the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Implement API endpoints',
  })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Create REST API endpoints for the task assignment feature',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'UUID of the user assigned to the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  assignedUserId?: string;

  @ApiProperty({
    description: 'Current status of the task',
    enum: ['pending', 'completed'],
    example: 'pending',
  })
  status: 'pending' | 'completed';

  @ApiProperty({
    description: 'Timestamp when the task was created',
    example: '2023-04-18T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the task was last updated',
    example: '2023-04-18T12:30:00.000Z',
  })
  updatedAt: Date;
}
