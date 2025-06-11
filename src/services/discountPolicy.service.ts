import { DiscountPolicyModel } from '../models/discountPolicy.model';
import {
  IDiscountPolicy,
  IDiscountPolicyCreate,
  IDiscountPolicyUpdate,
  IActiveDiscountPolicy,
} from '../interfaces/discountPolicy.interface';

export class DiscountPolicyService {
  private discountPolicyModel = new DiscountPolicyModel();

  public async getAllPolicies(): Promise<IDiscountPolicy[]> {
    return this.discountPolicyModel.getAllPolicies();
  }

  public async getPolicyByMachine(
    machineId: number
  ): Promise<IDiscountPolicy | null> {
    return this.discountPolicyModel.getPolicyByMachine(machineId);
  }

  public async getActivePolicies(): Promise<IActiveDiscountPolicy[]> {
    return this.discountPolicyModel.getActivePolicies();
  }

  public async createPolicy(
    policyData: IDiscountPolicyCreate
  ): Promise<IDiscountPolicy> {
    // Validate required fields
    if (
      !policyData.MachineId ||
      policyData.DiscountPer === undefined ||
      !policyData.StartDate ||
      !policyData.EndDate
    ) {
      throw new Error('All required fields must be provided');
    }

    // Validate discount percentage
    if (policyData.DiscountPer < 0 || policyData.DiscountPer > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }

    // Validate date range
    if (new Date(policyData.StartDate) > new Date(policyData.EndDate)) {
      throw new Error('Start date must be before end date');
    }

    return this.discountPolicyModel.createPolicy(policyData);
  }

  public async updatePolicy(
    machineId: number,
    policyData: IDiscountPolicyUpdate
  ): Promise<IDiscountPolicy | null> {
    // Check if policy exists
    const existingPolicy =
      await this.discountPolicyModel.getPolicyByMachine(machineId);
    if (!existingPolicy) {
      throw new Error('Discount policy not found');
    }

    // Validate discount percentage if provided
    if (
      policyData.DiscountPer !== undefined &&
      (policyData.DiscountPer < 0 || policyData.DiscountPer > 100)
    ) {
      throw new Error('Discount percentage must be between 0 and 100');
    }

    // Validate date range if both dates are provided
    if (
      policyData.StartDate &&
      policyData.EndDate &&
      new Date(policyData.StartDate) > new Date(policyData.EndDate)
    ) {
      throw new Error('Start date must be before end date');
    }

    return this.discountPolicyModel.updatePolicy(machineId, policyData);
  }

  public async deletePolicy(
    machineId: number,
    hardDelete: boolean = false
  ): Promise<boolean> {
    // Check if policy exists
    const existingPolicy =
      await this.discountPolicyModel.getPolicyByMachine(machineId);
    if (!existingPolicy) {
      throw new Error('Discount policy not found');
    }

    if (hardDelete) {
      return this.discountPolicyModel.hardDeletePolicy(machineId);
    }
    return this.discountPolicyModel.softDeletePolicy(machineId);
  }
}
