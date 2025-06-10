export interface ILaundryHall {
  UID: number;
  HallID?: number;
  HALLNAME: string;
  Address: string;
  GPSLT: number;
  GPSLG: number;
  WaitingTime: number;
  isDeleted: number;
  isDeletedDate?: Date | null;
  otherInfo?: string | null;
}

export interface ILaundryHallCreate {
  UID: number;
  HALLNAME: string;
  Address: string;
  GPSLT: number;
  GPSLG: number;
  WaitingTime: number;
  otherInfo?: string;
}

export interface ILaundryHallUpdate {
  UID?: number;
  HALLNAME?: string;
  Address?: string;
  GPSLT?: number;
  GPSLG?: number;
  WaitingTime?: number;
  isDeleted?: number;
  isDeletedDate?: Date | null;
  otherInfo?: string | null;
}
