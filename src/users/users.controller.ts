import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AllowedUserType } from 'src/guards/auth/decorators/role.decorator';
import { UserDTO } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  @AllowedUserType('onroad')
  @UseGuards(AuthGuard)
  async getAll() {
    return await this.usersService.getAllUsers();
  }

  // FIXME: onroad should only have access to this one
  @Post('/create')
  @AllowedUserType('normal')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() userDTO: UserDTO) {
    await this.usersService.createUser(userDTO);
    return {};
  }

  // TODO: delete user
}
