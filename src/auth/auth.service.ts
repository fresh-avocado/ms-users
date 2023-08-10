import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getSignInMsg() {
    return 'signin';
  }
  getSignUpMsg() {
    return 'signup';
  }
}
