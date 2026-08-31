import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);
      delete (savedUser as any).password;
      return savedUser;
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
      order: { created_at: 'DESC' },
    });

    // Remove a senha de cada usuário retornado na lista
    const sanitizedData = data.map(({ password, ...user }) => user);

    return {
      data: sanitizedData,
      meta: { total, page, lastPage: Math.ceil(total / limit), limit },
    };
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('Id Not Found.');

      const { password, ...result } = user;
      return result;
    } catch (error: any) {
      if (error.code == '22P02') {
        throw new NotFoundException('Id Not Found.');
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userRepository.update(id, updateUserDto);
    } catch (error: any) {
      if (error.code == '22P02') {
        throw new NotFoundException('Id Not Found.');
      }
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}