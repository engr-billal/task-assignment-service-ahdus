import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { users, User } from '../schema';

@Injectable()
export class UsersService {
  // Simulate finding a user by ID
  async findById(id: string): Promise<User | null> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  // Simulate checking if a user exists
  async checkUserExists(id: string): Promise<boolean> {
    const user = await this.findById(id);
    return !!user;
  }

  // Simulate checking if user has admin role
  async isAdmin(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user.role === 'admin';
  }

  // Get all users (for demo purposes)
  async findAll(): Promise<User[]> {
    return db.select().from(users);
  }
}
