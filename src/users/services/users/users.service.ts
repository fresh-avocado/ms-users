import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/users/dtos/user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/users/constants/constants';

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

  async createUser(userDTO: UserDTO): Promise<void> {
    try {
      userDTO.password = await bcrypt.hash(userDTO.password, SALT_ROUNDS);
      const newUser = this.userRepository.create(userDTO);
      await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(
        `error creating user: ${JSON.stringify(error, null, 2)}`,
      );
      throw new BadRequestException(`${error.driverError.detail}`);
    }
  }
}
