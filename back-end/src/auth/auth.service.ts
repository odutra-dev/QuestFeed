import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { Payload } from '../common/types/payload/index.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { PubSubService } from '../providers/pubsub/pubsub.service.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly pubSubService: PubSubService
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

    await this.pubSubService.publish('user-registered-topic', {
      email: user.email,
      name: user.username,
    });

    const fullUser = await this.usersService.findByEmail(createUserDto.email);

    return {
      user,
      ...(await this.generateToken(fullUser)),
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