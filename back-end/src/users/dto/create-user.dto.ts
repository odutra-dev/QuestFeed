import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, MinLength, } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'User email address for authentication and contact',
        example: 'user@email.com',
        type: String,
    })
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email should not be empty.' })
    email: string;

    @ApiProperty({
        description: 'User account password (minimum of 6 characters)',
        example: 'StrongPassword123@',
        type: String,
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty({ message: 'Password should not be empty.' })
    @MinLength(6, { message: 'Password must be at least 6 characters long.' })
    password: string;

    @ApiProperty({
        description: 'Username displayed on the profile',
        example: 'john_doe',
        type: String,
        minLength: 3,
    })
    @IsString()
    @IsNotEmpty({ message: 'Username should not be empty.' })
    @Length(3, 50, { message: 'Username must be between 3 and 50 characters long.' })
    username: string;
}