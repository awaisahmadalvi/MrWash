import { pool } from '../config/database';
import {
  ILaundryHall,
  ILaundryHallCreate,
  ILaundryHallUpdate,
} from '../interfaces/laundryHall.interface';

export class LaundryHallModel {
  async getAllHalls(): Promise<ILaundryHall[]> {
    const result = await pool
      .request()
      .query('SELECT * FROM LaundryHall WHERE isDeleted = 0');
    return result.recordset;
  }

  async getHallById(id: number): Promise<ILaundryHall | null> {
    const result = await pool
      .request()
      .input('HallID', id)
      .query(
        'SELECT * FROM LaundryHall WHERE HallID = @HallID AND isDeleted = 0'
      );
    return result.recordset[0] || null;
  }

  async getHallsByUniversity(uid: number): Promise<ILaundryHall[]> {
    const result = await pool
      .request()
      .input('UID', uid)
      .query('SELECT * FROM LaundryHall WHERE UID = @UID AND isDeleted = 0');
    return result.recordset;
  }

  async createHall(hallData: ILaundryHallCreate): Promise<ILaundryHall> {
    const result = await pool
      .request()
      .input('UID', hallData.UID)
      .input('HALLNAME', hallData.HALLNAME)
      .input('Address', hallData.Address)
      .input('GPSLT', hallData.GPSLT)
      .input('GPSLG', hallData.GPSLG)
      .input('WaitingTime', hallData.WaitingTime)
      .input('otherInfo', hallData.otherInfo || null).query(`
                INSERT INTO LaundryHall (
                    UID, HALLNAME, Address, GPSLT, GPSLG, 
                    WaitingTime, otherInfo
                )
                OUTPUT INSERTED.*
                VALUES (
                    @UID, @HALLNAME, @Address, @GPSLT, @GPSLG,
                    @WaitingTime, @otherInfo
                )
            `);
    return result.recordset[0];
  }

  async updateHall(
    id: number,
    hallData: ILaundryHallUpdate
  ): Promise<ILaundryHall | null> {
    const result = await pool
      .request()
      .input('HallID', id)
      .input('UID', hallData.UID || null)
      .input('HALLNAME', hallData.HALLNAME || null)
      .input('Address', hallData.Address || null)
      .input('GPSLT', hallData.GPSLT || null)
      .input('GPSLG', hallData.GPSLG || null)
      .input('WaitingTime', hallData.WaitingTime || null)
      .input('isDeleted', hallData.isDeleted || null)
      .input('isDeletedDate', hallData.isDeletedDate || null)
      .input('otherInfo', hallData.otherInfo || null).query(`
                UPDATE LaundryHall SET
                    UID = COALESCE(@UID, UID),
                    HALLNAME = COALESCE(@HALLNAME, HALLNAME),
                    Address = COALESCE(@Address, Address),
                    GPSLT = COALESCE(@GPSLT, GPSLT),
                    GPSLG = COALESCE(@GPSLG, GPSLG),
                    WaitingTime = COALESCE(@WaitingTime, WaitingTime),
                    isDeleted = COALESCE(@isDeleted, isDeleted),
                    isDeletedDate = COALESCE(@isDeletedDate, isDeletedDate),
                    otherInfo = COALESCE(@otherInfo, otherInfo)
                OUTPUT INSERTED.*
                WHERE HallID = @HallID
            `);
    return result.recordset[0] || null;
  }

  async softDeleteHall(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('HallID', id)
      .query(
        'UPDATE LaundryHall SET isDeleted = 1, isDeletedDate = GETDATE() WHERE HallID = @HallID'
      );
    return result.rowsAffected[0] > 0;
  }

  async hardDeleteHall(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('HallID', id)
      .query('DELETE FROM LaundryHall WHERE HallID = @HallID');
    return result.rowsAffected[0] > 0;
  }
}
