import { Request, Response } from 'express';
import { LaundryUserService } from '../services/laundryUser.service';
import {
  ILaundryUser,
  ILaundryUserCreate,
  ILaundryUserUpdate,
} from '../interfaces/laundryUser.interface';

export class LaundryUserController {
  private laundryUserService = new LaundryUserService();

  private sendResponse(
    res: Response,
    data: any,
    message?: string,
    statusCode: number = 200
  ): void {
    const response = {
      success: true,
      data,
      ...(message && { message }),
    };
    res.status(statusCode).json(response);
  }

  private sendError(res: Response, statusCode: number, message: string): void {
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.laundryUserService.getAllUsers();
      this.sendResponse(res, users);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch users');
    }
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid user ID');
      }

      const user = await this.laundryUserService.getUserById(id);
      if (user) {
        this.sendResponse(res, user);
      } else {
        this.sendError(res, 404, 'User not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch user');
    }
  };

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: ILaundryUserCreate = req.body;

      // Validate required fields
      if (!userData.Username || !userData.Password) {
        return this.sendError(res, 400, 'Username and Password are required');
      }

      const newUser = await this.laundryUserService.createUser(userData);
      this.sendResponse(res, newUser, 'User created successfully', 201);
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Username already exists') {
        this.sendError(res, 409, error.message);
      } else {
        this.sendError(res, 500, 'Failed to create user');
      }
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid user ID');
      }

      const userData: ILaundryUserUpdate = req.body;
      const updatedUser = await this.laundryUserService.updateUser(
        id,
        userData
      );

      if (updatedUser) {
        this.sendResponse(res, updatedUser, 'User updated successfully');
      } else {
        this.sendError(res, 404, 'User not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'User not found') {
        this.sendError(res, 404, error.message);
      } else if (error.message === 'Username already exists') {
        this.sendError(res, 409, error.message);
      } else {
        this.sendError(res, 500, 'Failed to update user');
      }
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid user ID');
      }

      const hardDelete = req.query.hardDelete === 'true';
      const success = await this.laundryUserService.deleteUser(id, hardDelete);

      if (success) {
        this.sendResponse(
          res,
          null,
          `User ${hardDelete ? 'permanently' : 'soft'} deleted successfully`
        );
      } else {
        this.sendError(res, 404, 'User not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to delete user');
    }
  };
}
