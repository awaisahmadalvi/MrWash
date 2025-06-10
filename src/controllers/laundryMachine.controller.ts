import { Request, Response } from 'express';
import { LaundryMachineService } from '../services/laundryMachine.service';
import {
  ILaundryMachine,
  ILaundryMachineCreate,
  ILaundryMachineUpdate,
  IMachineStatusUpdate,
} from '../interfaces/laundryMachine.interface';

export class LaundryMachineController {
  private laundryMachineService = new LaundryMachineService();

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

  public getAllMachines = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const machines = await this.laundryMachineService.getAllMachines();
      this.sendResponse(res, machines);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch machines');
    }
  };

  public getMachinesByHall = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const hallId = parseInt(req.params.hallId);
      if (isNaN(hallId)) {
        return this.sendError(res, 400, 'Invalid hall ID');
      }

      const machines =
        await this.laundryMachineService.getMachinesByHall(hallId);
      this.sendResponse(res, machines);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch machines for hall');
    }
  };

  public getMachineById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid machine ID');
      }

      const machine = await this.laundryMachineService.getMachineById(id);
      if (machine) {
        this.sendResponse(res, machine);
      } else {
        this.sendError(res, 404, 'Machine not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch machine');
    }
  };

  public createMachine = async (req: Request, res: Response): Promise<void> => {
    try {
      const machineData: ILaundryMachineCreate = req.body;

      // Validate required fields
      if (!machineData.HallID) {
        return this.sendError(res, 400, 'HallID is required');
      }

      const newMachine =
        await this.laundryMachineService.createMachine(machineData);
      this.sendResponse(res, newMachine, 'Machine created successfully', 201);
    } catch (error: any) {
      console.error(error);
      if (error.message === 'HallID is required') {
        this.sendError(res, 400, error.message);
      } else {
        this.sendError(res, 500, 'Failed to create machine');
      }
    }
  };

  public updateMachine = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid machine ID');
      }

      const machineData: ILaundryMachineUpdate = req.body;
      const updatedMachine = await this.laundryMachineService.updateMachine(
        id,
        machineData
      );

      if (updatedMachine) {
        this.sendResponse(res, updatedMachine, 'Machine updated successfully');
      } else {
        this.sendError(res, 404, 'Machine not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Machine not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to update machine');
      }
    }
  };

  public updateMachineStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid machine ID');
      }

      const statusData: IMachineStatusUpdate = req.body;
      if (!statusData.MachineStatus) {
        return this.sendError(res, 400, 'MachineStatus is required');
      }

      const updatedMachine =
        await this.laundryMachineService.updateMachineStatus(id, statusData);

      if (updatedMachine) {
        this.sendResponse(
          res,
          updatedMachine,
          'Machine status updated successfully'
        );
      } else {
        this.sendError(res, 404, 'Machine not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Machine not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to update machine status');
      }
    }
  };

  public toggleMachinePower = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid machine ID');
      }

      const isOn = req.body.isOn;
      if (typeof isOn !== 'boolean') {
        return this.sendError(res, 400, 'isOn must be a boolean');
      }

      const updatedMachine =
        await this.laundryMachineService.toggleMachinePower(id, isOn);

      if (updatedMachine) {
        this.sendResponse(
          res,
          updatedMachine,
          `Machine turned ${isOn ? 'on' : 'off'} successfully`
        );
      } else {
        this.sendError(res, 404, 'Machine not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Machine not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to toggle machine power');
      }
    }
  };

  public deleteMachine = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid machine ID');
      }

      const hardDelete = req.query.hardDelete === 'true';
      const success = await this.laundryMachineService.deleteMachine(
        id,
        hardDelete
      );

      if (success) {
        this.sendResponse(
          res,
          null,
          `Machine ${hardDelete ? 'permanently' : 'soft'} deleted successfully`
        );
      } else {
        this.sendError(res, 404, 'Machine not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Machine not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to delete machine');
      }
    }
  };
}
