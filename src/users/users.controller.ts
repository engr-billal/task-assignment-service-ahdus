import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../schema';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users',
    type: [UserEntity],
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
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user with the specified ID',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
