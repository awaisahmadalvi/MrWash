import { pool } from '../config/database';
import {
  IWashesHistory,
  IWashesHistoryCreate,
  IWashesHistoryUpdate,
  IWashStatusUpdate,
} from '../interfaces/washesHistory.interface';

export class WashesHistoryModel {
  async getAllWashes(): Promise<IWashesHistory[]> {
    const result = await pool
      .request()
      .query('SELECT * FROM WashesHistory WHERE isDeleted = 0');
    return result.recordset;
  }

  async getWashesByUser(userId: number): Promise<IWashesHistory[]> {
    const result = await pool
      .request()
      .input('UserId', userId)
      .query(
        'SELECT * FROM WashesHistory WHERE UserId = @UserId AND isDeleted = 0 ORDER BY StartTime DESC'
      );
    return result.recordset;
  }

  async getWashesByMachine(machineId: number): Promise<IWashesHistory[]> {
    const result = await pool
      .request()
      .input('MachineId', machineId)
      .query(
        'SELECT * FROM WashesHistory WHERE MachineId = @MachineId AND isDeleted = 0 ORDER BY StartTime DESC'
      );
    return result.recordset;
  }

  async getWashById(id: number): Promise<IWashesHistory | null> {
    const result = await pool
      .request()
      .input('WHID', id)
      .query(
        'SELECT * FROM WashesHistory WHERE WHID = @WHID AND isDeleted = 0'
      );
    return result.recordset[0] || null;
  }

  async createWash(washData: IWashesHistoryCreate): Promise<IWashesHistory> {
    const result = await pool
      .request()
      .input('SLID', washData.SLID)
      .input('MachineId', washData.MachineId)
      .input('UserId', washData.UserId)
      .input('StartTime', washData.StartTime || new Date())
      .input('Description', washData.Description || null)
      .input('otherInfo', washData.otherInfo || null).query(`
                INSERT INTO WashesHistory (
                    SLID, MachineId, UserId, StartTime, Description, otherInfo
                )
                OUTPUT INSERTED.*
                VALUES (
                    @SLID, @MachineId, @UserId, @StartTime, @Description, @otherInfo
                )
            `);
    return result.recordset[0];
  }

  async updateWash(
    id: number,
    washData: IWashesHistoryUpdate
  ): Promise<IWashesHistory | null> {
    const result = await pool
      .request()
      .input('WHID', id)
      .input('SLID', washData.SLID || null)
      .input('MachineId', washData.MachineId || null)
      .input('UserId', washData.UserId || null)
      .input('StartTime', washData.StartTime || null)
      .input('WashStartTime', washData.WashStartTime || null)
      .input('WashEndTime', washData.WashEndTime || null)
      .input('Description', washData.Description || null)
      .input('WashStatus', washData.WashStatus || null)
      .input('isDeleted', washData.isDeleted || null)
      .input('isDeletedDate', washData.isDeletedDate || null)
      .input('otherInfo', washData.otherInfo || null).query(`
                UPDATE WashesHistory SET
                    SLID = COALESCE(@SLID, SLID),
                    MachineId = COALESCE(@MachineId, MachineId),
                    UserId = COALESCE(@UserId, UserId),
                    StartTime = COALESCE(@StartTime, StartTime),
                    WashStartTime = COALESCE(@WashStartTime, WashStartTime),
                    WashEndTime = COALESCE(@WashEndTime, WashEndTime),
                    Description = COALESCE(@Description, Description),
                    WashStatus = COALESCE(@WashStatus, WashStatus),
                    isDeleted = COALESCE(@isDeleted, isDeleted),
                    isDeletedDate = COALESCE(@isDeletedDate, isDeletedDate),
                    otherInfo = COALESCE(@otherInfo, otherInfo)
                OUTPUT INSERTED.*
                WHERE WHID = @WHID
            `);
    return result.recordset[0] || null;
  }

  async updateWashStatus(
    id: number,
    statusData: IWashStatusUpdate
  ): Promise<IWashesHistory | null> {
    const result = await pool
      .request()
      .input('WHID', id)
      .input('WashStatus', statusData.WashStatus)
      .input('WashStartTime', statusData.WashStartTime || null)
      .input('WashEndTime', statusData.WashEndTime || null).query(`
                UPDATE WashesHistory SET
                    WashStatus = @WashStatus,
                    WashStartTime = COALESCE(@WashStartTime, WashStartTime),
                    WashEndTime = COALESCE(@WashEndTime, WashEndTime)
                OUTPUT INSERTED.*
                WHERE WHID = @WHID
            `);
    return result.recordset[0] || null;
  }

  async softDeleteWash(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('WHID', id)
      .query(
        'UPDATE WashesHistory SET isDeleted = 1, isDeletedDate = GETDATE() WHERE WHID = @WHID'
      );
    return result.rowsAffected[0] > 0;
  }

  async hardDeleteWash(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('WHID', id)
      .query('DELETE FROM WashesHistory WHERE WHID = @WHID');
    return result.rowsAffected[0] > 0;
  }
}
