import { ConflictException, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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


  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (error: any) {

      if (error.code === '23505') {
        if (error.detail?.includes('email')) {
          throw new ConflictException('Email already exists.');
        }
        if (error.detail?.includes('username')) {
          throw new ConflictException('Username already exists.');
        }
        throw new ConflictException('Data conflict detected.');
      }

      throw new InternalServerErrorException('Error creating user.');
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: {
        created_at: 'DESC'
      },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async findOne(id: string) {
    try {
      return await this.userRepository.findOne({
        where: {
          id
        }
      })
    }
    catch (error: any) {

      if (error.code == '22P02') {
        throw new BadRequestException('Id Not exists.')
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    try {
      return await this.userRepository.update(id, updateUserDto);
    } catch (error: any) {
      console.log(error)

      if (error.code == '22P02') {
        throw new BadRequestException('Id Not exists.')
      }
    }

  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
