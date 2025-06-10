import { UserModel } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

export class UserService {
  private userModel = new UserModel();

  public async getAllUsers(): Promise<IUser[]> {
    return this.userModel.getAllUsers();
  }

  public async getUserById(id: number): Promise<IUser | null> {
    return this.userModel.getUserById(id);
  }

  public async createUser(userData: IUser): Promise<IUser> {
    return this.userModel.createUser(userData);
  }

  public async updateUser(id: number, userData: IUser): Promise<IUser | null> {
    return this.userModel.updateUser(id, userData);
  }

  public async deleteUser(id: number): Promise<boolean> {
    return this.userModel.deleteUser(id);
  }
}
