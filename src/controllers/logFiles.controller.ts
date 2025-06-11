import { Request, Response } from 'express';
import { LogFilesService } from '../services/logFiles.service';
import { ILogFile } from '../interfaces/logFiles.interface';

export class LogFilesController {
  private logFilesService = new LogFilesService();

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

  public getAllLogFiles = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const logFiles = await this.logFilesService.getAllLogFiles();
      this.sendResponse(res, logFiles);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch log files');
    }
  };

  public getLogFileById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid log file ID');
      }

      const logFile = await this.logFilesService.getLogFileById(id);
      if (logFile) {
        this.sendResponse(res, logFile);
      } else {
        this.sendError(res, 404, 'Log file not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch log file');
    }
  };

  public getLogFilesByMachine = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const machineId = parseInt(req.params.machineId);
      if (isNaN(machineId)) {
        return this.sendError(res, 400, 'Invalid machine ID');
      }

      const logFiles =
        await this.logFilesService.getLogFilesByMachine(machineId);
      this.sendResponse(res, logFiles);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch log files for machine');
    }
  };

  public getLogFilesByTransaction = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      if (isNaN(transactionId)) {
        return this.sendError(res, 400, 'Invalid transaction ID');
      }

      const logFiles =
        await this.logFilesService.getLogFilesByTransaction(transactionId);
      this.sendResponse(res, logFiles);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch log files for transaction');
    }
  };

  public createLogFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const logFileData = req.body;

      // Validate required fields
      if (!logFileData.FilePath) {
        return this.sendError(res, 400, 'FilePath is required');
      }

      const newLogFile = await this.logFilesService.createLogFile(logFileData);
      this.sendResponse(res, newLogFile, 'Log file created successfully', 201);
    } catch (error: any) {
      console.error(error);
      if (error.message === 'FilePath is required') {
        this.sendError(res, 400, error.message);
      } else {
        this.sendError(res, 500, 'Failed to create log file');
      }
    }
  };

  public updateLogFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid log file ID');
      }

      const logFileData = req.body;
      const updatedLogFile = await this.logFilesService.updateLogFile(
        id,
        logFileData
      );

      if (updatedLogFile) {
        this.sendResponse(res, updatedLogFile, 'Log file updated successfully');
      } else {
        this.sendError(res, 404, 'Log file not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Log file not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to update log file');
      }
    }
  };

  public deleteLogFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid log file ID');
      }

      const success = await this.logFilesService.deleteLogFile(id);

      if (success) {
        this.sendResponse(res, null, 'Log file deleted successfully');
      } else {
        this.sendError(res, 404, 'Log file not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Log file not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to delete log file');
      }
    }
  };
}
