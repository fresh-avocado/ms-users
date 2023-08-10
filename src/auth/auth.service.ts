import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDTO } from './dtos/SignInDTO.dto';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';
import { SignUpDTO } from './dtos/SignUpDTO.dto';
import { UserType } from 'src/users/enums/userType';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UsersService,
  ) {}

  async signUp(signUpDTO: SignUpDTO): Promise<string> {
    const user = await this.userService.createUser({
      ...signUpDTO,
      type: UserType.NORMAL,
    });
    const sessionId = await this.redisService.createSession({
      userEmail: user.email,
      userType: user.type,
      shoppingCart: [],
    });
    return sessionId;
  }

  async signIn(signInDTO: SignInDTO): Promise<string> {
    const user = await this.userService.getUser(signInDTO.email);
    const res = await bcrypt.compare(signInDTO.password, user.password);
    if (res === false) {
      throw new HttpException(
        { msg: 'Wrong email or password' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const sessionId = await this.redisService.createSession(
      user.type === 'normal'
        ? {
            userEmail: user.email,
            userType: user.type,
            shoppingCart: [],
          }
        : {
            userEmail: user.email,
            userType: user.type,
          },
    );
    return sessionId;
  }
}
