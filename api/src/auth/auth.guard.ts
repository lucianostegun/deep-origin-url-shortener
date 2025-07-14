import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];

    if (!userId || typeof userId !== 'string') {
      console.log('User ID header is missing');
      return false;
    }

    const user = await this.usersService.findByPublicId(userId);

    if (!user) {
      console.log(`User not found for ID: ${userId}`);
      return false;
    }

    request['user'] = user;

    return true;
  }
}
