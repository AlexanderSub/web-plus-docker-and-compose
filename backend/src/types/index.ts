import { User } from 'src/users/entities/user.entity';

export interface IUserRequest extends Request {
  user: User;
}
