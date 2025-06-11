import { LogFilesModel } from '../models/logFiles.model';
import {
  ILogFile,
  ILogFileCreate,
  ILogFileUpdate,
} from '../interfaces/logFiles.interface';

export class LogFilesService {
  private logFilesModel = new LogFilesModel();

  public async getAllLogFiles(): Promise<ILogFile[]> {
    return this.logFilesModel.getAllLogFiles();
  }

  public async getLogFileById(id: number): Promise<ILogFile | null> {
    return this.logFilesModel.getLogFileById(id);
  }

  public async getLogFilesByMachine(machineId: number): Promise<ILogFile[]> {
    return this.logFilesModel.getLogFilesByMachine(machineId);
  }

  public async getLogFilesByTransaction(
    transactionId: number
  ): Promise<ILogFile[]> {
    return this.logFilesModel.getLogFilesByTransaction(transactionId);
  }

  public async createLogFile(logFileData: ILogFileCreate): Promise<ILogFile> {
    // Validate required fields
    if (!logFileData.FilePath) {
      throw new Error('FilePath is required');
    }

    return this.logFilesModel.createLogFile(logFileData);
  }

  public async updateLogFile(
    id: number,
    logFileData: ILogFileUpdate
  ): Promise<ILogFile | null> {
    // Check if log file exists
    const existingLogFile = await this.logFilesModel.getLogFileById(id);
    if (!existingLogFile) {
      throw new Error('Log file not found');
    }

    return this.logFilesModel.updateLogFile(id, logFileData);
  }

  public async deleteLogFile(id: number): Promise<boolean> {
    // Check if log file exists
    const existingLogFile = await this.logFilesModel.getLogFileById(id);
    if (!existingLogFile) {
      throw new Error('Log file not found');
    }

    return this.logFilesModel.deleteLogFile(id);
  }
}
