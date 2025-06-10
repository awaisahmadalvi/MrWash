import { Request, Response } from 'express';
import { LaundryHallService } from '../services/laundryHall.service';
import {
  ILaundryHall,
  ILaundryHallCreate,
  ILaundryHallUpdate,
} from '../interfaces/laundryHall.interface';

export class LaundryHallController {
  private laundryHallService = new LaundryHallService();

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

  public getAllHalls = async (req: Request, res: Response): Promise<void> => {
    try {
      const halls = await this.laundryHallService.getAllHalls();
      this.sendResponse(res, halls);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch laundry halls');
    }
  };

  public getHallsByUniversity = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const uid = parseInt(req.params.uid);
      if (isNaN(uid)) {
        return this.sendError(res, 400, 'Invalid university ID');
      }

      const halls = await this.laundryHallService.getHallsByUniversity(uid);
      this.sendResponse(res, halls);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch laundry halls for university');
    }
  };

  public getHallById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid hall ID');
      }

      const hall = await this.laundryHallService.getHallById(id);
      if (hall) {
        this.sendResponse(res, hall);
      } else {
        this.sendError(res, 404, 'Laundry hall not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch laundry hall');
    }
  };

  public createHall = async (req: Request, res: Response): Promise<void> => {
    try {
      const hallData: ILaundryHallCreate = req.body;

      // Validate required fields
      if (
        !hallData.UID ||
        !hallData.HALLNAME ||
        !hallData.Address ||
        hallData.GPSLT === undefined ||
        hallData.GPSLG === undefined ||
        hallData.WaitingTime === undefined
      ) {
        return this.sendError(res, 400, 'All required fields must be provided');
      }

      const newHall = await this.laundryHallService.createHall(hallData);
      this.sendResponse(res, newHall, 'Laundry hall created successfully', 201);
    } catch (error: any) {
      console.error(error);
      if (error.message === 'All required fields must be provided') {
        this.sendError(res, 400, error.message);
      } else {
        this.sendError(res, 500, 'Failed to create laundry hall');
      }
    }
  };

  public updateHall = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid hall ID');
      }

      const hallData: ILaundryHallUpdate = req.body;
      const updatedHall = await this.laundryHallService.updateHall(
        id,
        hallData
      );

      if (updatedHall) {
        this.sendResponse(
          res,
          updatedHall,
          'Laundry hall updated successfully'
        );
      } else {
        this.sendError(res, 404, 'Laundry hall not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Laundry hall not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to update laundry hall');
      }
    }
  };

  public deleteHall = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid hall ID');
      }

      const hardDelete = req.query.hardDelete === 'true';
      const success = await this.laundryHallService.deleteHall(id, hardDelete);

      if (success) {
        this.sendResponse(
          res,
          null,
          `Laundry hall ${hardDelete ? 'permanently' : 'soft'} deleted successfully`
        );
      } else {
        this.sendError(res, 404, 'Laundry hall not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Laundry hall not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to delete laundry hall');
      }
    }
  };
}
