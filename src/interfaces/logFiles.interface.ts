export interface ILogFile {
  logFileId?: number;
  transactionId?: number | null;
  MachineId?: number | null;
  FilePath?: string | null;
}

export interface ILogFileCreate {
  transactionId?: number;
  MachineId?: number;
  FilePath: string;
}

export interface ILogFileUpdate {
  transactionId?: number | null;
  MachineId?: number | null;
  FilePath?: string | null;
}
