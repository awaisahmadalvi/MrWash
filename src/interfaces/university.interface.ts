export interface IUniversity {
  UID?: number;
  University: string | null;
  isDeleted: number;
  isDeletedDate?: Date | null;
  otherInfo?: string | null;
  UniAddress?: string | null;
}

export interface IUniversityCreate {
  University: string | null;
  otherInfo?: string | null;
  UniAddress?: string | null;
}

export interface IUniversityUpdate {
  University?: string | null;
  isDeleted?: number;
  isDeletedDate?: Date | null;
  otherInfo?: string | null;
  UniAddress?: string | null;
}
