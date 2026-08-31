import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { Payload } from '../common/types/payload/index.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  private async generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      expired: false,
      access_token: await this.jwtService.signAsync(payload),
      token_type: "bearer",
      expires_in: 3599
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const fullUser = await this.usersService.findByEmail(createUserDto.email);

    return {
      user,
      ...(await this.generateToken(fullUser)), // Retorna os dados do token
    };
  }

  async signIn(createAuthDto: CreateAuthDto) {
    const user = await this.usersService.findByEmail(createAuthDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(createAuthDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }
}