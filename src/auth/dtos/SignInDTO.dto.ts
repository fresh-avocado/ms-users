import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserDTO } from 'src/users/dtos/user.dto';

type SignInDTOType = Pick<UserDTO, 'email' | 'password'>;

export class SignInDTO implements SignInDTOType {
  @MaxLength(64)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,64}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y máximo 64 caracteres',
  })
  password: string;
}
