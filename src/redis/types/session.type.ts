import { UserType } from 'src/users/enums/enums';

export type ClientSession = {
  userId: string;
  userType: UserType;
  shoppingCart?: any[]; // TODO: type
};
