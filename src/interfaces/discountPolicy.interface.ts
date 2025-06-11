export interface IDiscountPolicy {
  MachineId: number;
  DiscountPer: number;
  StartDate: Date;
  EndDate: Date;
  isDeleted: number;
  isDeletedDate?: Date | null;
  otherInfo?: string | null;
}

export interface IDiscountPolicyCreate {
  MachineId: number;
  DiscountPer: number;
  StartDate: Date;
  EndDate: Date;
  otherInfo?: string;
}

export interface IDiscountPolicyUpdate {
  DiscountPer?: number;
  StartDate?: Date;
  EndDate?: Date;
  isDeleted?: number;
  isDeletedDate?: Date | null;
  otherInfo?: string | null;
}

export interface IActiveDiscountPolicy extends IDiscountPolicy {
  IsActive: boolean;
}
