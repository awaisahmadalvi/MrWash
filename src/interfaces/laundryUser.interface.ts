export interface ILaundryUser {
  UserID?: number;
  Username: string;
  Password: string;
  firstname?: string | null;
  lastname?: string | null;
  address?: string | null;
  accountType?: string | null;
  UserDegree?: string | null;
  isDeleted?: number | null;
  cellNo?: string | null;
  IMEI?: string | null;
  cnic?: string | null;
  email?: string | null;
  otherInfo?: string | null;
}

export interface ILaundryUserCreate {
  Username: string;
  Password: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  accountType?: string;
  UserDegree?: string;
  cellNo?: string;
  IMEI?: string;
  cnic?: string;
  email?: string;
  otherInfo?: string;
}

export interface ILaundryUserUpdate {
  Username?: string;
  Password?: string;
  firstname?: string | null;
  lastname?: string | null;
  address?: string | null;
  accountType?: string | null;
  UserDegree?: string | null;
  isDeleted?: number | null;
  cellNo?: string | null;
  IMEI?: string | null;
  cnic?: string | null;
  email?: string | null;
  otherInfo?: string | null;
}

export interface IAuth {
  id: string;
  Username: string;
  Password: string;
}
