import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async verifyByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email
      }
    })
  }

  async verifyByUserName(username: string) {
    return await this.userRepository.findOne({
      where: {
        username: username
      }
    })
  }


  async create(createUserDto: CreateUserDto) {

    const existsEmail = await this.verifyByEmail(createUserDto.email);
    const existsUserName = await this.verifyByUserName(createUserDto.username);

    if (existsEmail) {
      throw new ConflictException('Email already exists.');
    }

    if (existsUserName) {
      throw new ConflictException('Username already exists.');
    }

    try {
      const newUser = this.userRepository.create(createUserDto);

      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user.');
    }
  }

  async findAll() {
    return this.userRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
