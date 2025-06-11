export interface IStudentLedger {
  SLID?: number;
  UserId: number;
  ModeofPayment: string;
  Deposit: number;
  Withdraw: number;
  Description: string;
  MachineId: number;
  isDeleted: number;
  isDeletedDate?: Date | null;
  transactionDate?: Date | null;
  entryDate?: Date | null;
  otherInfo?: string | null;
}

export interface IStudentLedgerCreate {
  UserId: number;
  ModeofPayment: string;
  Deposit: number;
  Withdraw: number;
  Description: string;
  MachineId: number;
  transactionDate?: Date;
  otherInfo?: string;
}

export interface IStudentLedgerUpdate {
  UserId?: number;
  ModeofPayment?: string;
  Deposit?: number;
  Withdraw?: number;
  Description?: string;
  MachineId?: number;
  isDeleted?: number;
  isDeletedDate?: Date | null;
  transactionDate?: Date | null;
  otherInfo?: string | null;
}

export interface IStudentBalance {
  UserId: number;
  Balance: number;
}
