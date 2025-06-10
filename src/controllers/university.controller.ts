import { Request, Response } from 'express';
import { UniversityService } from '../services/university.service';
import {
  IUniversity,
  IUniversityCreate,
  IUniversityUpdate,
} from '../interfaces/university.interface';

export class UniversityController {
  private universityService = new UniversityService();

  private sendResponse(res: Response, data: any, message?: string): void {
    const response = {
      success: true,
      data,
      ...(message && { message }),
    };
    res.status(200).json(response);
  }

  private sendError(res: Response, statusCode: number, message: string): void {
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }

  public getAllUniversities = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const universities = await this.universityService.getAllUniversities();
      this.sendResponse(res, universities);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch universities');
    }
  };

  public getUniversityById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid university ID');
      }

      const university = await this.universityService.getUniversityById(id);
      if (university) {
        this.sendResponse(res, university);
      } else {
        this.sendError(res, 404, 'University not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch university');
    }
  };

  public createUniversity = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const universityData: IUniversityCreate = req.body;
      if (!universityData.University) {
        return this.sendError(res, 400, 'University name is required');
      }

      const newUniversity =
        await this.universityService.createUniversity(universityData);
      this.sendResponse(res, newUniversity, 'University created successfully');
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to create university');
    }
  };

  public updateUniversity = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid university ID');
      }

      const universityData: IUniversityUpdate = req.body;
      const updatedUniversity = await this.universityService.updateUniversity(
        id,
        universityData
      );

      if (updatedUniversity) {
        this.sendResponse(
          res,
          updatedUniversity,
          'University updated successfully'
        );
      } else {
        this.sendError(res, 404, 'University not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to update university');
    }
  };

  public deleteUniversity = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid university ID');
      }

      const softDelete = req.query.hardDelete !== 'true';
      const success = softDelete
        ? await this.universityService.softDeleteUniversity(id)
        : await this.universityService.hardDeleteUniversity(id);

      if (success) {
        this.sendResponse(
          res,
          null,
          `University ${softDelete ? 'soft' : 'hard'} deleted successfully`
        );
      } else {
        this.sendError(res, 404, 'University not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to delete university');
    }
  };
}
