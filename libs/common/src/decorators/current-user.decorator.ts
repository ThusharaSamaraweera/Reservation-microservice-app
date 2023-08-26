import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from '../../../../apps/auth/src/users/modal/user.schema';

const getCurrentUserByContext = (ctx: ExecutionContext): UserDocument => {
  return ctx.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) =>
  getCurrentUserByContext(ctx),
);
