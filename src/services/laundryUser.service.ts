import { LaundryUserModel } from '../models/laundryUser.model';
import {
  ILaundryUser,
  ILaundryUserCreate,
  ILaundryUserUpdate,
} from '../interfaces/laundryUser.interface';

export class LaundryUserService {
  private laundryUserModel = new LaundryUserModel();

  public async getAllUsers(): Promise<ILaundryUser[]> {
    return this.laundryUserModel.getAllUsers();
  }

  public async getUserById(id: number): Promise<ILaundryUser | null> {
    return this.laundryUserModel.getUserById(id);
  }

  public async getUserByUsername(
    Username: string
  ): Promise<ILaundryUser | null> {
    return this.laundryUserModel.getUserByUsername(Username);
  }

  public async createUser(userData: ILaundryUserCreate): Promise<ILaundryUser> {
    // Check if username already exists
    const existingUser = await this.laundryUserModel.getUserByUsername(
      userData.Username
    );
    if (existingUser) {
      throw new Error('Username already exists');
    }

    return this.laundryUserModel.createUser(userData);
  }

  public async updateUser(
    id: number,
    userData: ILaundryUserUpdate
  ): Promise<ILaundryUser | null> {
    // Check if user exists
    const existingUser = await this.laundryUserModel.getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // If username is being updated, check if new username is available
    if (userData.Username && userData.Username !== existingUser.Username) {
      const usernameExists = await this.laundryUserModel.getUserByUsername(
        userData.Username
      );
      if (usernameExists) {
        throw new Error('Username already exists');
      }
    }

    return this.laundryUserModel.updateUser(id, userData);
  }

  public async deleteUser(
    id: number,
    hardDelete: boolean = false
  ): Promise<boolean> {
    if (hardDelete) {
      return this.laundryUserModel.hardDeleteUser(id);
    }
    return this.laundryUserModel.softDeleteUser(id);
  }
}
