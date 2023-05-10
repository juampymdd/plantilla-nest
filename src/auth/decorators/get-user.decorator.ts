import { ExecutionContext, createParamDecorator, InternalServerErrorException } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  const user =  req.user;
  

  if( !user ){
    throw new InternalServerErrorException('No se ha encontrado el usuario');
  }

  return (!data ) ? user : user[data];
})