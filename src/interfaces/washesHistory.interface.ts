export interface IWashesHistory {
  WHID?: number;
  SLID: number;
  MachineId: number;
  UserId: number;
  StartTime?: Date | null;
  WashStartTime?: Date | null;
  WashEndTime?: Date | null;
  Description?: string | null;
  WashStatus?: number | null;
  isDeleted: number;
  isDeletedDate?: Date | null;
  otherInfo?: string | null;
}

export interface IWashesHistoryCreate {
  SLID: number;
  MachineId: number;
  UserId: number;
  StartTime?: Date;
  Description?: string;
  isDeleted: number;
  otherInfo?: string;
}

export interface IWashesHistoryUpdate {
  SLID?: number;
  MachineId?: number;
  UserId?: number;
  StartTime?: Date | null;
  WashStartTime?: Date | null;
  WashEndTime?: Date | null;
  Description?: string | null;
  WashStatus?: number | null;
  isDeleted?: number;
  isDeletedDate?: Date | null;
  otherInfo?: string | null;
}

export interface IWashStatusUpdate {
  WashStatus: number;
  WashStartTime?: Date;
  WashEndTime?: Date;
}
