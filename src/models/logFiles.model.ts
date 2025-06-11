import { pool } from '../config/database';
import {
  ILogFile,
  ILogFileCreate,
  ILogFileUpdate,
} from '../interfaces/logFiles.interface';

export class LogFilesModel {
  async getAllLogFiles(): Promise<ILogFile[]> {
    const result = await pool.request().query('SELECT * FROM logFiles');
    return result.recordset;
  }

  async getLogFileById(id: number): Promise<ILogFile | null> {
    const result = await pool
      .request()
      .input('logFileId', id)
      .query('SELECT * FROM logFiles WHERE logFileId = @logFileId');
    return result.recordset[0] || null;
  }

  async getLogFilesByMachine(machineId: number): Promise<ILogFile[]> {
    const result = await pool
      .request()
      .input('MachineId', machineId)
      .query('SELECT * FROM logFiles WHERE MachineId = @MachineId');
    return result.recordset;
  }

  async getLogFilesByTransaction(transactionId: number): Promise<ILogFile[]> {
    const result = await pool
      .request()
      .input('transactionId', transactionId)
      .query('SELECT * FROM logFiles WHERE transactionId = @transactionId');
    return result.recordset;
  }

  async createLogFile(logFileData: ILogFileCreate): Promise<ILogFile> {
    const result = await pool
      .request()
      .input('transactionId', logFileData.transactionId || null)
      .input('MachineId', logFileData.MachineId || null)
      .input('FilePath', logFileData.FilePath).query(`
                INSERT INTO logFiles (
                    transactionId, MachineId, FilePath
                )
                OUTPUT INSERTED.*
                VALUES (
                    @transactionId, @MachineId, @FilePath
                )
            `);
    return result.recordset[0];
  }

  async updateLogFile(
    id: number,
    logFileData: ILogFileUpdate
  ): Promise<ILogFile | null> {
    const result = await pool
      .request()
      .input('logFileId', id)
      .input('transactionId', logFileData.transactionId || null)
      .input('MachineId', logFileData.MachineId || null)
      .input('FilePath', logFileData.FilePath || null).query(`
                UPDATE logFiles SET
                    transactionId = COALESCE(@transactionId, transactionId),
                    MachineId = COALESCE(@MachineId, MachineId),
                    FilePath = COALESCE(@FilePath, FilePath)
                OUTPUT INSERTED.*
                WHERE logFileId = @logFileId
            `);
    return result.recordset[0] || null;
  }

  async deleteLogFile(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('logFileId', id)
      .query('DELETE FROM logFiles WHERE logFileId = @logFileId');
    return result.rowsAffected[0] > 0;
  }
}
