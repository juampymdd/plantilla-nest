import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuardGuard } from './guards/user-role-guard/user-role-guard.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto ) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() headers: any
  ) {
    console.log(user, headers)
    return {
      user,
      userEmail,
      headers
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.user)
  @UseGuards( AuthGuard(), UserRoleGuardGuard )
  privateRoute2(
    @GetUser() user :User
  ){
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.superUser, ValidRoles.user)
  privateRoute3(
    @GetUser() user :User
  ){
    return {
      ok: true,
      user
    }
  }
  
  @Get('check-status')
  @Auth()
  chekcAuthStatus(
    @GetUser() user: User,
  ){
    return this.authService.checkAuthStatus(user);
  }
}


