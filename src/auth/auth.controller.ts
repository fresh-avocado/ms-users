import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dtos/SignUpDTO.dto';
import { SignInDTO } from './dtos/SignInDTO.dto';

// TODO: rate limit endpoints

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() signInDTO: SignInDTO) {
    this.logger.log(`signin: ${JSON.stringify(signInDTO, null, 2)}`);
    return { msg: this.authService.getSignInMsg() };
  }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signUpDTO: SignUpDTO) {
    this.logger.log(`signup: ${JSON.stringify(signUpDTO, null, 2)}`);
    return { msg: this.authService.getSignUpMsg() };
  }
}
