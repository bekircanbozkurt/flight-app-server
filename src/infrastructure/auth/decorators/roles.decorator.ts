import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserRole } from '../../../domain/entities/user.entity';

export const ROLES_KEY = 'roles';
export const UserRoles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);

export const GetUserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserRole => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.role;
  },
);
