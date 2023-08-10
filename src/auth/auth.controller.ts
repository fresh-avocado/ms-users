import {
  Body,
  Controller,
  Logger,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dtos/SignUpDTO.dto';
import { SignInDTO } from './dtos/SignInDTO.dto';
import { FastifyReply } from 'fastify';
import { COOKIE_OPTIONS } from 'src/users/constants/constants';

// TODO: rate limit endpoints

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/signIn')
  @UsePipes(ValidationPipe)
  async signin(@Body() signInDTO: SignInDTO, @Res() res: FastifyReply) {
    const sessionId = await this.authService.signIn(signInDTO);
    res.setCookie('sessionId', sessionId, COOKIE_OPTIONS);
    res.send({});
  }

  @Post('/signUp')
  @UsePipes(ValidationPipe)
  async signup(@Body() signUpDTO: SignUpDTO, @Res() res: FastifyReply) {
    const sessionId = await this.authService.signUp(signUpDTO);
    res.setCookie('sessionId', sessionId, COOKIE_OPTIONS);
    res.send({});
  }
}
