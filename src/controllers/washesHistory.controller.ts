import { Request, Response } from 'express';
import { WashesHistoryService } from '../services/washesHistory.service';
import {
  IWashesHistory,
  IWashStatusUpdate,
} from '../interfaces/washesHistory.interface';

export class WashesHistoryController {
  private washesHistoryService = new WashesHistoryService();

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

  public getAllWashes = async (req: Request, res: Response): Promise<void> => {
    try {
      const washes = await this.washesHistoryService.getAllWashes();
      this.sendResponse(res, washes);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch wash history');
    }
  };

  public getWashesByUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return this.sendError(res, 400, 'Invalid user ID');
      }

      const washes = await this.washesHistoryService.getWashesByUser(userId);
      this.sendResponse(res, washes);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch user wash history');
    }
  };

  public getWashesByMachine = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const machineId = parseInt(req.params.machineId);
      if (isNaN(machineId)) {
        return this.sendError(res, 400, 'Invalid machine ID');
      }

      const washes =
        await this.washesHistoryService.getWashesByMachine(machineId);
      this.sendResponse(res, washes);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch machine wash history');
    }
  };

  public getWashById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid wash ID');
      }

      const wash = await this.washesHistoryService.getWashById(id);
      if (wash) {
        this.sendResponse(res, wash);
      } else {
        this.sendError(res, 404, 'Wash record not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch wash record');
    }
  };

  public createWash = async (req: Request, res: Response): Promise<void> => {
    try {
      const washData = req.body;

      // Validate required fields
      if (!washData.SLID || !washData.MachineId || !washData.UserId) {
        return this.sendError(
          res,
          400,
          'SLID, MachineId, and UserId are required'
        );
      }

      const newWash = await this.washesHistoryService.createWash(washData);
      this.sendResponse(res, newWash, 'Wash record created successfully', 201);
    } catch (error: any) {
      console.error(error);
      if (error.message === 'SLID, MachineId, and UserId are required') {
        this.sendError(res, 400, error.message);
      } else {
        this.sendError(res, 500, 'Failed to create wash record');
      }
    }
  };

  public updateWash = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid wash ID');
      }

      const washData = req.body;
      const updatedWash = await this.washesHistoryService.updateWash(
        id,
        washData
      );

      if (updatedWash) {
        this.sendResponse(res, updatedWash, 'Wash record updated successfully');
      } else {
        this.sendError(res, 404, 'Wash record not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Wash record not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to update wash record');
      }
    }
  };

  public updateWashStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid wash ID');
      }

      const statusData: IWashStatusUpdate = req.body;
      if (statusData.WashStatus === undefined) {
        return this.sendError(res, 400, 'WashStatus is required');
      }

      const updatedWash = await this.washesHistoryService.updateWashStatus(
        id,
        statusData
      );

      if (updatedWash) {
        this.sendResponse(res, updatedWash, 'Wash status updated successfully');
      } else {
        this.sendError(res, 404, 'Wash record not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Wash record not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to update wash status');
      }
    }
  };

  public deleteWash = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid wash ID');
      }

      const hardDelete = req.query.hardDelete === 'true';
      const success = await this.washesHistoryService.deleteWash(
        id,
        hardDelete
      );

      if (success) {
        this.sendResponse(
          res,
          null,
          `Wash record ${hardDelete ? 'permanently' : 'soft'} deleted successfully`
        );
      } else {
        this.sendError(res, 404, 'Wash record not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Wash record not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to delete wash record');
      }
    }
  };
}
