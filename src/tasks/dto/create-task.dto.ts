import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Implement API endpoints',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Create REST API endpoints for the task assignment feature',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'UUID of the user assigned to the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  assignedUserId?: string;
}
