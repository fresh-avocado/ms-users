import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDTO } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  async getAll() {
    return await this.usersService.getAllUsers();
  }

  @Post('/create')
  @UsePipes(ValidationPipe)
  async create(@Body() userDTO: UserDTO) {
    await this.usersService.createUser(userDTO);
    return {};
  }
}
