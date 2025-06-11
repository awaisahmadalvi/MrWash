import { pool } from '../config/database';
import {
  IStudentLedger,
  IStudentLedgerCreate,
  IStudentLedgerUpdate,
  IStudentBalance,
} from '../interfaces/studentLedger.interface';

export class StudentLedgerModel {
  async getAllTransactions(): Promise<IStudentLedger[]> {
    const result = await pool
      .request()
      .query('SELECT * FROM StudentLedger WHERE isDeleted = 0');
    return result.recordset;
  }

  async getTransactionsByUser(userId: number): Promise<IStudentLedger[]> {
    const result = await pool
      .request()
      .input('UserId', userId)
      .query(
        'SELECT * FROM StudentLedger WHERE UserId = @UserId AND isDeleted = 0 ORDER BY transactionDate DESC'
      );
    return result.recordset;
  }

  async getTransactionById(id: number): Promise<IStudentLedger | null> {
    const result = await pool
      .request()
      .input('SLID', id)
      .query(
        'SELECT * FROM StudentLedger WHERE SLID = @SLID AND isDeleted = 0'
      );
    return result.recordset[0] || null;
  }

  async getStudentBalance(userId: number): Promise<IStudentBalance> {
    const result = await pool.request().input('UserId', userId).query(`
                SELECT 
                    UserId, 
                    SUM(Deposit) - SUM(Withdraw) AS Balance
                FROM StudentLedger 
                WHERE UserId = @UserId AND isDeleted = 0
                GROUP BY UserId
            `);
    return result.recordset[0] || { UserId: userId, Balance: 0 };
  }

  async createTransaction(
    transactionData: IStudentLedgerCreate
  ): Promise<IStudentLedger> {
    const result = await pool
      .request()
      .input('UserId', transactionData.UserId)
      .input('ModeofPayment', transactionData.ModeofPayment)
      .input('Deposit', transactionData.Deposit)
      .input('Withdraw', transactionData.Withdraw)
      .input('Description', transactionData.Description)
      .input('MachineId', transactionData.MachineId)
      .input('transactionDate', transactionData.transactionDate || new Date())
      .input('otherInfo', transactionData.otherInfo || null).query(`
                INSERT INTO StudentLedger (
                    UserId, ModeofPayment, Deposit, Withdraw, Description,
                    MachineId, transactionDate, entryDate, otherInfo
                )
                OUTPUT INSERTED.*
                VALUES (
                    @UserId, @ModeofPayment, @Deposit, @Withdraw, @Description,
                    @MachineId, @transactionDate, GETDATE(), @otherInfo
                )
            `);
    return result.recordset[0];
  }

  async updateTransaction(
    id: number,
    transactionData: IStudentLedgerUpdate
  ): Promise<IStudentLedger | null> {
    const result = await pool
      .request()
      .input('SLID', id)
      .input('UserId', transactionData.UserId || null)
      .input('ModeofPayment', transactionData.ModeofPayment || null)
      .input('Deposit', transactionData.Deposit || null)
      .input('Withdraw', transactionData.Withdraw || null)
      .input('Description', transactionData.Description || null)
      .input('MachineId', transactionData.MachineId || null)
      .input('isDeleted', transactionData.isDeleted || null)
      .input('isDeletedDate', transactionData.isDeletedDate || null)
      .input('transactionDate', transactionData.transactionDate || null)
      .input('otherInfo', transactionData.otherInfo || null).query(`
                UPDATE StudentLedger SET
                    UserId = COALESCE(@UserId, UserId),
                    ModeofPayment = COALESCE(@ModeofPayment, ModeofPayment),
                    Deposit = COALESCE(@Deposit, Deposit),
                    Withdraw = COALESCE(@Withdraw, Withdraw),
                    Description = COALESCE(@Description, Description),
                    MachineId = COALESCE(@MachineId, MachineId),
                    isDeleted = COALESCE(@isDeleted, isDeleted),
                    isDeletedDate = COALESCE(@isDeletedDate, isDeletedDate),
                    transactionDate = COALESCE(@transactionDate, transactionDate),
                    otherInfo = COALESCE(@otherInfo, otherInfo)
                OUTPUT INSERTED.*
                WHERE SLID = @SLID
            `);
    return result.recordset[0] || null;
  }

  async softDeleteTransaction(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('SLID', id)
      .query(
        'UPDATE StudentLedger SET isDeleted = 1, isDeletedDate = GETDATE() WHERE SLID = @SLID'
      );
    return result.rowsAffected[0] > 0;
  }

  async hardDeleteTransaction(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('SLID', id)
      .query('DELETE FROM StudentLedger WHERE SLID = @SLID');
    return result.rowsAffected[0] > 0;
  }
}
