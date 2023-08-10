import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/users/dtos/user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/users/constants/constants';
import { stringifyError } from 'src/utils/stringifyError';

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
      throw new Error('could not get users');
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
        'No se pudo crear el usuario',
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
      throw new HttpException(
        'No se pudo crear el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (user === null) {
      throw new HttpException(
        { msg: 'Non-existent user' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}
