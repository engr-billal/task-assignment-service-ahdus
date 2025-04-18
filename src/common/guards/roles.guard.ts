import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Get user role from request header
    const userRole = request.headers['x-user-role'];
    const userId = request.headers['x-user-id'];

    // If role header is not provided or user ID is missing
    if (!userRole || !userId) {
      throw new ForbiddenException(
        'Missing required role or user ID information',
      );
    }

    // Check if the user exists and has the required role
    if (requiredRoles.includes('admin') && userRole !== 'admin') {
      // For admin routes, double-check against the database
      try {
        const isAdmin = await this.usersService.isAdmin(userId);
        return isAdmin;
      } catch (error) {
        throw new ForbiddenException(
          `User does not have sufficient privileges ${error}`,
        );
      }
    }

    // For non-admin roles, just check the header value
    return requiredRoles.includes(userRole);
  }
}
