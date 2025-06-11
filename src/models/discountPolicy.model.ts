import { pool } from '../config/database';
import {
  IDiscountPolicy,
  IDiscountPolicyCreate,
  IDiscountPolicyUpdate,
  IActiveDiscountPolicy,
} from '../interfaces/discountPolicy.interface';

export class DiscountPolicyModel {
  async getAllPolicies(): Promise<IDiscountPolicy[]> {
    const result = await pool
      .request()
      .query('SELECT * FROM DiscountPolicy WHERE isDeleted = 0');
    return result.recordset;
  }

  async getPolicyByMachine(machineId: number): Promise<IDiscountPolicy | null> {
    const result = await pool
      .request()
      .input('MachineId', machineId)
      .query(
        'SELECT * FROM DiscountPolicy WHERE MachineId = @MachineId AND isDeleted = 0'
      );
    return result.recordset[0] || null;
  }

  async getActivePolicies(): Promise<IActiveDiscountPolicy[]> {
    const currentDate = new Date().toISOString().split('T')[0];
    const result = await pool.request().query(`
                SELECT *, 
                    CASE 
                        WHEN StartDate <= '${currentDate}' AND EndDate >= '${currentDate}' THEN 1
                        ELSE 0
                    END AS IsActive
                FROM DiscountPolicy 
                WHERE isDeleted = 0
            `);
    return result.recordset;
  }

  async createPolicy(
    policyData: IDiscountPolicyCreate
  ): Promise<IDiscountPolicy> {
    const result = await pool
      .request()
      .input('MachineId', policyData.MachineId)
      .input('DiscountPer', policyData.DiscountPer)
      .input('StartDate', policyData.StartDate)
      .input('EndDate', policyData.EndDate)
      .input('otherInfo', policyData.otherInfo || null).query(`
                INSERT INTO DiscountPolicy (
                    MachineId, DiscountPer, StartDate, EndDate, otherInfo
                )
                OUTPUT INSERTED.*
                VALUES (
                    @MachineId, @DiscountPer, @StartDate, @EndDate, @otherInfo
                )
            `);
    return result.recordset[0];
  }

  async updatePolicy(
    machineId: number,
    policyData: IDiscountPolicyUpdate
  ): Promise<IDiscountPolicy | null> {
    const result = await pool
      .request()
      .input('MachineId', machineId)
      .input('DiscountPer', policyData.DiscountPer || null)
      .input('StartDate', policyData.StartDate || null)
      .input('EndDate', policyData.EndDate || null)
      .input('isDeleted', policyData.isDeleted || null)
      .input('isDeletedDate', policyData.isDeletedDate || null)
      .input('otherInfo', policyData.otherInfo || null).query(`
                UPDATE DiscountPolicy SET
                    DiscountPer = COALESCE(@DiscountPer, DiscountPer),
                    StartDate = COALESCE(@StartDate, StartDate),
                    EndDate = COALESCE(@EndDate, EndDate),
                    isDeleted = COALESCE(@isDeleted, isDeleted),
                    isDeletedDate = COALESCE(@isDeletedDate, isDeletedDate),
                    otherInfo = COALESCE(@otherInfo, otherInfo)
                OUTPUT INSERTED.*
                WHERE MachineId = @MachineId
            `);
    return result.recordset[0] || null;
  }

  async softDeletePolicy(machineId: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('MachineId', machineId)
      .query(
        'UPDATE DiscountPolicy SET isDeleted = 1, isDeletedDate = GETDATE() WHERE MachineId = @MachineId'
      );
    return result.rowsAffected[0] > 0;
  }

  async hardDeletePolicy(machineId: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('MachineId', machineId)
      .query('DELETE FROM DiscountPolicy WHERE MachineId = @MachineId');
    return result.rowsAffected[0] > 0;
  }
}
