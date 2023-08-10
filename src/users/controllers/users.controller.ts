import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { COOKIE_OPTIONS } from 'src/users/constants/constants';
import { UserDTO } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  @UseGuards(AuthenticationGuard)
  async getAll() {
    return await this.usersService.getAllUsers();
  }

  // TODO: validate cookie has not been tampered
  // TODO: get session data and return it

  @Post('/create')
  @UsePipes(ValidationPipe)
  async create(@Body() userDTO: UserDTO, @Res() res: FastifyReply) {
    const sessionId = await this.usersService.createUser(userDTO);
    res.setCookie('sessionId', sessionId, COOKIE_OPTIONS);
    res.send({});
    return;
  }
}
