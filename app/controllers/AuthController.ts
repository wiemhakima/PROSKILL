import { User, UserModel } from '../../models/User';

const userModel = new UserModel();

export class AuthController {
  static async login(email: string, password: string): Promise<{ success: boolean; message: string; userId?: number }> {
    const user = await userModel.findByEmail(email);
    if (user && user.password === password) { // Use bcrypt.compare() in production
      return { success: true, message: 'Login successful', userId: user.id };
    }
    return { success: false, message: 'Invalid credentials' };
  }
}