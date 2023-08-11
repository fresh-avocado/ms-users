import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/users/dtos/user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/users/constants/constants';
import { stringifyError } from 'src/utils/stringifyError';
import {
  CREATE_USER_ERROR,
  GET_USERS_ERROR,
  GET_USER_ERROR,
  NON_EXISTENT_USER_ERROR,
} from 'src/utils/constants/errorMessages';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.logger.error(
        `error getting all users: ${JSON.stringify(error, null, 2)}`,
      );
      throw new HttpException(
        { msg: GET_USERS_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(userDTO: UserDTO): Promise<User> {
    try {
      userDTO.password = await bcrypt.hash(userDTO.password, SALT_ROUNDS);
      const newUser = this.userRepository.create(userDTO);
      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } catch (error) {
      this.logger.error(`error creating user: ${stringifyError(error)}`);
      throw new HttpException(
        CREATE_USER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(email: string): Promise<User> {
    let user: User | null;
    try {
      user = await this.userRepository.findOne({
        select: {
          email: true,
          password: true,
          type: true,
        },
        where: {
          email,
        },
      });
    } catch (error) {
      this.logger.error(`error finding user: ${stringifyError(error)}`);
      throw new HttpException(GET_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (user === null) {
      throw new HttpException(
        { msg: NON_EXISTENT_USER_ERROR },
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}
