import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Updated task title',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Updated description for the task',
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

  @ApiProperty({
    description: 'Current status of the task',
    enum: ['pending', 'completed'],
    example: 'completed',
    required: false,
  })
  @IsEnum(['pending', 'completed'])
  @IsOptional()
  status?: 'pending' | 'completed';
}
