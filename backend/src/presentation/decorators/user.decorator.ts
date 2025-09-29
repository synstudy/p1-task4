import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type UserRole = 'ADMIN' | 'USER';

export interface JwtPayload {
  sub: string; // user ID
  role: UserRole; // user role
}

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
