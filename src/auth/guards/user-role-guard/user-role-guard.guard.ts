import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuardGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get<string[]>(META_ROLES, context.getHandler());
    const req = context.switchToHttp().getRequest();
    const user =  req.user;
    
    if( !user ){
      throw new BadRequestException('No se ha encontrado el usuario');
    }

    console.log({userRoles: user.roles, validRoles})
    
    if (! validRoles || validRoles.length === 0)  return true;

    for(const role of user.roles){
      if(validRoles.includes(role)){
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${user.fullName} does not have permission to access this resource. Valid roles: [${validRoles}]`
    );
  }
}
