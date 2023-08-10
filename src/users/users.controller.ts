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
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AllowedUserType } from 'src/guards/auth/decorators/role.decorator';
import { COOKIE_OPTIONS } from 'src/users/constants/constants';
import { UserDTO } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  @AllowedUserType('normal')
  @UseGuards(AuthGuard)
  async getAll() {
    return await this.usersService.getAllUsers();
  }

  @Post('/create')
  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() userDTO: UserDTO, @Res() res: FastifyReply) {
    // TODO: only create user
    const sessionId = await this.usersService.createUser(userDTO);
    res.setCookie('sessionId', sessionId, COOKIE_OPTIONS);
    res.send({});
    return;
  }

  // TODO: delete user
}
