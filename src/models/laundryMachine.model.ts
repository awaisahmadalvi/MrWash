import { pool } from '../config/database';
import {
  ILaundryMachine,
  ILaundryMachineCreate,
  ILaundryMachineUpdate,
  IMachineStatusUpdate,
} from '../interfaces/laundryMachine.interface';

export class LaundryMachineModel {
  async getAllMachines(): Promise<ILaundryMachine[]> {
    const result = await pool
      .request()
      .query('SELECT * FROM LaundryMachines WHERE isDeleted = 0');
    return result.recordset;
  }

  async getMachinesByHall(hallId: number): Promise<ILaundryMachine[]> {
    const result = await pool
      .request()
      .input('HallID', hallId)
      .query(
        'SELECT * FROM LaundryMachines WHERE HallID = @HallID AND isDeleted = 0'
      );
    return result.recordset;
  }

  async getMachineById(id: number): Promise<ILaundryMachine | null> {
    const result = await pool
      .request()
      .input('MachineID', id)
      .query(
        'SELECT * FROM LaundryMachines WHERE MachineID = @MachineID AND isDeleted = 0'
      );
    return result.recordset[0] || null;
  }

  async createMachine(
    machineData: ILaundryMachineCreate
  ): Promise<ILaundryMachine> {
    const result = await pool
      .request()
      .input('HallID', machineData.HallID)
      .input('MachineType', machineData.MachineType || null)
      .input('Description', machineData.Description || null)
      .input('Rate', machineData.Rate || null)
      .input('MachineCycleTime', machineData.MachineCycleTime || null)
      .input('MachineStatus', machineData.MachineStatus || 'Available')
      .input('InstallDate', machineData.InstallDate || null)
      .input('otherInfo', machineData.otherInfo || null)
      .input('MacAddress', machineData.MacAddress || null)
      .input('Res_TranID', machineData.Res_TranID || null)
      .input('IsTurnOn', machineData.IsTurnOn || 0).query(`
                INSERT INTO LaundryMachines (
                    HallID, MachineType, Description, Rate, MachineCycleTime,
                    MachineStatus, InstallDate, otherInfo, MacAddress, Res_TranID, IsTurnOn
                )
                OUTPUT INSERTED.*
                VALUES (
                    @HallID, @MachineType, @Description, @Rate, @MachineCycleTime,
                    @MachineStatus, @InstallDate, @otherInfo, @MacAddress, @Res_TranID, @IsTurnOn
                )
            `);
    return result.recordset[0];
  }

  async updateMachine(
    id: number,
    machineData: ILaundryMachineUpdate
  ): Promise<ILaundryMachine | null> {
    const result = await pool
      .request()
      .input('MachineID', id)
      .input('HallID', machineData.HallID || null)
      .input('MachineType', machineData.MachineType || null)
      .input('Description', machineData.Description || null)
      .input('Rate', machineData.Rate || null)
      .input('MachineCycleTime', machineData.MachineCycleTime || null)
      .input('MachineStatus', machineData.MachineStatus || null)
      .input('InstallDate', machineData.InstallDate || null)
      .input('isDeleted', machineData.isDeleted || null)
      .input('isDeletedDate', machineData.isDeletedDate || null)
      .input('otherInfo', machineData.otherInfo || null)
      .input('MacAddress', machineData.MacAddress || null)
      .input('Res_TranID', machineData.Res_TranID || null)
      .input('IsTurnOn', machineData.IsTurnOn || null).query(`
                UPDATE LaundryMachines SET
                    HallID = COALESCE(@HallID, HallID),
                    MachineType = COALESCE(@MachineType, MachineType),
                    Description = COALESCE(@Description, Description),
                    Rate = COALESCE(@Rate, Rate),
                    MachineCycleTime = COALESCE(@MachineCycleTime, MachineCycleTime),
                    MachineStatus = COALESCE(@MachineStatus, MachineStatus),
                    InstallDate = COALESCE(@InstallDate, InstallDate),
                    isDeleted = COALESCE(@isDeleted, isDeleted),
                    isDeletedDate = COALESCE(@isDeletedDate, isDeletedDate),
                    otherInfo = COALESCE(@otherInfo, otherInfo),
                    MacAddress = COALESCE(@MacAddress, MacAddress),
                    Res_TranID = COALESCE(@Res_TranID, Res_TranID),
                    IsTurnOn = COALESCE(@IsTurnOn, IsTurnOn)
                OUTPUT INSERTED.*
                WHERE MachineID = @MachineID
            `);
    return result.recordset[0] || null;
  }

  async updateMachineStatus(
    id: number,
    statusData: IMachineStatusUpdate
  ): Promise<ILaundryMachine | null> {
    const result = await pool
      .request()
      .input('MachineID', id)
      .input('MachineStatus', statusData.MachineStatus)
      .input('Res_TranID', statusData.Res_TranID || null).query(`
                UPDATE LaundryMachines SET
                    MachineStatus = @MachineStatus,
                    Res_TranID = COALESCE(@Res_TranID, Res_TranID)
                OUTPUT INSERTED.*
                WHERE MachineID = @MachineID
            `);
    return result.recordset[0] || null;
  }

  async toggleMachinePower(
    id: number,
    isOn: boolean
  ): Promise<ILaundryMachine | null> {
    const result = await pool
      .request()
      .input('MachineID', id)
      .input('IsTurnOn', isOn ? 1 : 0).query(`
                UPDATE LaundryMachines SET
                    IsTurnOn = @IsTurnOn
                OUTPUT INSERTED.*
                WHERE MachineID = @MachineID
            `);
    return result.recordset[0] || null;
  }

  async softDeleteMachine(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('MachineID', id)
      .query(
        'UPDATE LaundryMachines SET isDeleted = 1, isDeletedDate = GETDATE() WHERE MachineID = @MachineID'
      );
    return result.rowsAffected[0] > 0;
  }

  async hardDeleteMachine(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('MachineID', id)
      .query('DELETE FROM LaundryMachines WHERE MachineID = @MachineID');
    return result.rowsAffected[0] > 0;
  }
}
