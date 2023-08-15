import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from '../enums/userType';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email of the user' })
  @MaxLength(64)
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,64}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y máximo 64 caracteres',
  })
  password: string;

  @ApiProperty({
    description: 'User type',
    enum: [UserType.NORMAL, UserType.ON_ROAD],
  })
  @IsEnum(UserType)
  type: UserType;
}
