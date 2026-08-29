import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto.js';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'Username displayed on the profile',
        example: 'john_doe',
        type: String,
        minLength: 3,
    })
    @IsString()
    @IsNotEmpty({ message: 'Username should not be empty.' })
    @Length(3, 255, { message: 'Name must be between 3 and 255.' })
    name: string;
}
