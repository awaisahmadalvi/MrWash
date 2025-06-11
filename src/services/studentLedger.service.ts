import { StudentLedgerModel } from '../models/studentLedger.model';
import {
  IStudentLedger,
  IStudentLedgerCreate,
  IStudentLedgerUpdate,
  IStudentBalance,
} from '../interfaces/studentLedger.interface';

export class StudentLedgerService {
  private studentLedgerModel = new StudentLedgerModel();

  public async getAllTransactions(): Promise<IStudentLedger[]> {
    return this.studentLedgerModel.getAllTransactions();
  }

  public async getTransactionsByUser(
    userId: number
  ): Promise<IStudentLedger[]> {
    return this.studentLedgerModel.getTransactionsByUser(userId);
  }

  public async getTransactionById(id: number): Promise<IStudentLedger | null> {
    return this.studentLedgerModel.getTransactionById(id);
  }

  public async getStudentBalance(userId: number): Promise<IStudentBalance> {
    return this.studentLedgerModel.getStudentBalance(userId);
  }

  public async createTransaction(
    transactionData: IStudentLedgerCreate
  ): Promise<IStudentLedger> {
    // Validate required fields
    if (
      !transactionData.UserId ||
      !transactionData.ModeofPayment ||
      transactionData.Deposit === undefined ||
      transactionData.Withdraw === undefined ||
      !transactionData.Description ||
      !transactionData.MachineId
    ) {
      throw new Error('All required fields must be provided');
    }

    // Validate that either Deposit or Withdraw is positive
    if (transactionData.Deposit < 0 && transactionData.Withdraw < 0) {
      throw new Error('Either Deposit or Withdraw must be a positive value');
    }

    return this.studentLedgerModel.createTransaction(transactionData);
  }

  public async updateTransaction(
    id: number,
    transactionData: IStudentLedgerUpdate
  ): Promise<IStudentLedger | null> {
    // Check if transaction exists
    const existingTransaction =
      await this.studentLedgerModel.getTransactionById(id);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    return this.studentLedgerModel.updateTransaction(id, transactionData);
  }

  public async deleteTransaction(
    id: number,
    hardDelete: boolean = false
  ): Promise<boolean> {
    // Check if transaction exists
    const existingTransaction =
      await this.studentLedgerModel.getTransactionById(id);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    if (hardDelete) {
      return this.studentLedgerModel.hardDeleteTransaction(id);
    }
    return this.studentLedgerModel.softDeleteTransaction(id);
  }
}
