import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateAuthDto {
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
}
