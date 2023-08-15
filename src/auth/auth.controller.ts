import {
  Body,
  Controller,
  HttpCode,
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
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

// TODO: rate limit endpoints

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Signs a user in. Activates its session.' })
  @ApiCreatedResponse({ description: 'User was signed in' })
  @Post('/signIn')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async signin(@Body() signInDTO: SignInDTO, @Res() res: FastifyReply) {
    const sessionId = await this.authService.signIn(signInDTO);
    res.setCookie('sessionId', sessionId, COOKIE_OPTIONS);
    res.send({});
  }

  @ApiOperation({ summary: 'Creates a user. Activates its session.' })
  @ApiCreatedResponse({ description: 'User was created and signed in' })
  @Post('/signUp')
  @UsePipes(ValidationPipe)
  async signup(@Body() signUpDTO: SignUpDTO, @Res() res: FastifyReply) {
    const sessionId = await this.authService.signUp(signUpDTO);
    res.setCookie('sessionId', sessionId, COOKIE_OPTIONS);
    res.send({});
  }
}
