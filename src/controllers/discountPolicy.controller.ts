import { Request, Response } from 'express';
import { DiscountPolicyService } from '../services/discountPolicy.service';
import {
  IDiscountPolicy,
  IActiveDiscountPolicy,
} from '../interfaces/discountPolicy.interface';

export class DiscountPolicyController {
  private discountPolicyService = new DiscountPolicyService();

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

  public getAllPolicies = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const policies = await this.discountPolicyService.getAllPolicies();
      this.sendResponse(res, policies);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch discount policies');
    }
  };

  public getActivePolicies = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const policies = await this.discountPolicyService.getActivePolicies();
      this.sendResponse(res, policies);
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch active discount policies');
    }
  };

  public getPolicyByMachine = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const machineId = parseInt(req.params.machineId);
      if (isNaN(machineId)) {
        return this.sendError(res, 400, 'Invalid machine ID');
      }

      const policy =
        await this.discountPolicyService.getPolicyByMachine(machineId);
      if (policy) {
        this.sendResponse(res, policy);
      } else {
        this.sendError(res, 404, 'Discount policy not found');
      }
    } catch (error) {
      console.error(error);
      this.sendError(res, 500, 'Failed to fetch discount policy');
    }
  };

  public createPolicy = async (req: Request, res: Response): Promise<void> => {
    try {
      const policyData = req.body;

      // Validate required fields
      if (
        !policyData.MachineId ||
        policyData.DiscountPer === undefined ||
        !policyData.StartDate ||
        !policyData.EndDate
      ) {
        return this.sendError(res, 400, 'All required fields must be provided');
      }

      const newPolicy =
        await this.discountPolicyService.createPolicy(policyData);
      this.sendResponse(
        res,
        newPolicy,
        'Discount policy created successfully',
        201
      );
    } catch (error: any) {
      console.error(error);
      if (
        error.message === 'All required fields must be provided' ||
        error.message === 'Discount percentage must be between 0 and 100' ||
        error.message === 'Start date must be before end date'
      ) {
        this.sendError(res, 400, error.message);
      } else {
        this.sendError(res, 500, 'Failed to create discount policy');
      }
    }
  };

  public updatePolicy = async (req: Request, res: Response): Promise<void> => {
    try {
      const machineId = parseInt(req.params.machineId);
      if (isNaN(machineId)) {
        return this.sendError(res, 400, 'Invalid machine ID');
      }

      const policyData = req.body;
      const updatedPolicy = await this.discountPolicyService.updatePolicy(
        machineId,
        policyData
      );

      if (updatedPolicy) {
        this.sendResponse(
          res,
          updatedPolicy,
          'Discount policy updated successfully'
        );
      } else {
        this.sendError(res, 404, 'Discount policy not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Discount policy not found') {
        this.sendError(res, 404, error.message);
      } else if (
        error.message === 'Discount percentage must be between 0 and 100' ||
        error.message === 'Start date must be before end date'
      ) {
        this.sendError(res, 400, error.message);
      } else {
        this.sendError(res, 500, 'Failed to update discount policy');
      }
    }
  };

  public deletePolicy = async (req: Request, res: Response): Promise<void> => {
    try {
      const machineId = parseInt(req.params.machineId);
      if (isNaN(machineId)) {
        return this.sendError(res, 400, 'Invalid machine ID');
      }

      const hardDelete = req.query.hardDelete === 'true';
      const success = await this.discountPolicyService.deletePolicy(
        machineId,
        hardDelete
      );

      if (success) {
        this.sendResponse(
          res,
          null,
          `Discount policy ${hardDelete ? 'permanently' : 'soft'} deleted successfully`
        );
      } else {
        this.sendError(res, 404, 'Discount policy not found');
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Discount policy not found') {
        this.sendError(res, 404, error.message);
      } else {
        this.sendError(res, 500, 'Failed to delete discount policy');
      }
    }
  };
}
