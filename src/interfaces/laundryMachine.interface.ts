export interface ILaundryMachine {
  MachineID?: number;
  HallID: number;
  MachineType?: string | null;
  Description?: string | null;
  Rate?: number | null;
  MachineCycleTime?: number | null;
  MachineStatus?: string | null;
  InstallDate?: Date | null;
  isDeleted: number;
  isDeletedDate?: Date | null;
  otherInfo?: string | null;
  MacAddress?: string | null;
  Res_TranID?: number | null;
  IsTurnOn?: number | null;
}

export interface ILaundryMachineCreate {
  HallID: number;
  MachineType?: string;
  Description?: string;
  Rate?: number;
  MachineCycleTime?: number;
  MachineStatus?: string;
  InstallDate?: Date;
  otherInfo?: string;
  MacAddress?: string;
  Res_TranID?: number;
  IsTurnOn?: number;
}

export interface ILaundryMachineUpdate {
  HallID?: number;
  MachineType?: string | null;
  Description?: string | null;
  Rate?: number | null;
  MachineCycleTime?: number | null;
  MachineStatus?: string | null;
  InstallDate?: Date | null;
  isDeleted?: number;
  isDeletedDate?: Date | null;
  otherInfo?: string | null;
  MacAddress?: string | null;
  Res_TranID?: number | null;
  IsTurnOn?: number | null;
}

export interface IMachineStatusUpdate {
  MachineStatus: string;
  Res_TranID?: number | null;
}
