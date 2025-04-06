import { User } from '../../models/User';

declare global {
  namespace Express {
    interface User extends User {}
    
    interface Request {
      user?: User;
      isAuthenticated(): boolean;
      login(user: User, callback: (err: any) => void): void;
      logout(callback: (err: any) => void): void;
    }
  }
} 