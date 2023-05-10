import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtSetvice: JwtService
  ) {}
  async create(createUserDto: CreateUserDto) {
    try{
      
      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      
      await this.userRepository.save(user);
      delete user.password;
      
      //TODO: Retornar el JWT de acceso
      
      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };

    }catch(err){
      this.handleDBErrors(err);
    }
  }

  async login( loginUserDto: LoginUserDto ) {
    
    const {email, password} = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where: { email },
      select: {id: true, password: true, email: true }
    });

    if( !user ) 
      throw new UnauthorizedException('Invalid credentials');
    if( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Invalid credentials');
    
    return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };
  }

  async checkAuthStatus( user: User ) {
    const {id} = user;
    const userFound = await this.userRepository.findOne({ 
      where: { id },
    });
    if( !userFound ) 
      throw new UnauthorizedException('Invalid credentials');
    return {
      ...userFound,
      token: this.getJwtToken({id: userFound.id})
    };
  }

  private getJwtToken( payload:JwtPayload){
    
    const token = this.jwtSetvice.sign( payload );

    return token;
    
  }
  private handleDBErrors(error: any): never {

    if (error.code === '23505') {
      throw new BadRequestException( error.detail )
    }

    console.log(error);
    throw new InternalServerErrorException('Please check server logs')

  }
}
