import { Request, Response } from 'express';
import { StudentLedgerService } from '../services/studentLedger.service';
import {
  IStudentLedger,
  IStudentBalance,
} from '../interfaces/studentLedger.interface';

export class StudentLedgerController {
  private studentLedgerService = new StudentLedgerService();

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

  public getAllTransactions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const transactions = await this.studentLedgerService.getAllTransactions();
      this.sendResponse(res, transactions);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch transactions');
    }
  };

  public getTransactionsByUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return this.sendError(res, 400, 'Invalid user ID');
      }

      const transactions =
        await this.studentLedgerService.getTransactionsByUser(userId);
      this.sendResponse(res, transactions);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch user transactions');
    }
  };

  public getStudentBalance = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return this.sendError(res, 400, 'Invalid user ID');
      }

      const balance = await this.studentLedgerService.getStudentBalance(userId);
      this.sendResponse(res, balance);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch student balance');
    }
  };

  public getTransactionById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid transaction ID');
      }

      const transaction =
        await this.studentLedgerService.getTransactionById(id);
      if (transaction) {
        this.sendResponse(res, transaction);
      } else {
        this.sendError(res, 404, 'Transaction not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch transaction');
    }
  };

  public createTransaction = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const transactionData = req.body;

      // Validate required fields
      if (
        !transactionData.UserId ||
        !transactionData.ModeofPayment ||
        transactionData.Deposit === undefined ||
        transactionData.Withdraw === undefined ||
        !transactionData.Description ||
        !transactionData.MachineId
      ) {
        return this.sendError(res, 400, 'All required fields must be provided');
      }

      const newTransaction =
        await this.studentLedgerService.createTransaction(transactionData);
      this.sendResponse(
        res,
        newTransaction,
        'Transaction created successfully',
        201
      );
    } catch (error: any) {
      console.error(error);
      if (
        error.message === 'All required fields must be provided' ||
        error.message === 'Either Deposit or Withdraw must be a positive value'
      ) {
        this.sendError(res, 400, error.message);
      } else {
        this.sendError(res, 500, 'Failed to create transaction');
      }
    }
  };

  public updateTransaction = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid transaction ID');
      }

      const transactionData = req.body;
      const updatedTransaction =
        await this.studentLedgerService.updateTransaction(id, transactionData);

      if (updatedTransaction) {
        this.sendResponse(
          res,
          updatedTransaction,
          'Transaction updated successfully'
        );
      } else {
        this.sendError(res, 404, 'Transaction not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Transaction not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to update transaction');
      }
    }
  };

  public deleteTransaction = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return this.sendError(res, 400, 'Invalid transaction ID');
      }

      const hardDelete = req.query.hardDelete === 'true';
      const success = await this.studentLedgerService.deleteTransaction(
        id,
        hardDelete
      );

      if (success) {
        this.sendResponse(
          res,
          null,
          `Transaction ${hardDelete ? 'permanently' : 'soft'} deleted successfully`
        );
      } else {
        this.sendError(res, 404, 'Transaction not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Transaction not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to delete transaction');
      }
    }
  };
}
