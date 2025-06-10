import { LaundryMachineModel } from '../models/laundryMachine.model';
import {
  ILaundryMachine,
  ILaundryMachineCreate,
  ILaundryMachineUpdate,
  IMachineStatusUpdate,
} from '../interfaces/laundryMachine.interface';

export class LaundryMachineService {
  private laundryMachineModel = new LaundryMachineModel();

  public async getAllMachines(): Promise<ILaundryMachine[]> {
    return this.laundryMachineModel.getAllMachines();
  }

  public async getMachinesByHall(hallId: number): Promise<ILaundryMachine[]> {
    return this.laundryMachineModel.getMachinesByHall(hallId);
  }

  public async getMachineById(id: number): Promise<ILaundryMachine | null> {
    return this.laundryMachineModel.getMachineById(id);
  }

  public async createMachine(
    machineData: ILaundryMachineCreate
  ): Promise<ILaundryMachine> {
    // Validate required fields
    if (!machineData.HallID) {
      throw new Error('HallID is required');
    }

    return this.laundryMachineModel.createMachine(machineData);
  }

  public async updateMachine(
    id: number,
    machineData: ILaundryMachineUpdate
  ): Promise<ILaundryMachine | null> {
    // Check if machine exists
    const existingMachine = await this.laundryMachineModel.getMachineById(id);
    if (!existingMachine) {
      throw new Error('Machine not found');
    }

    return this.laundryMachineModel.updateMachine(id, machineData);
  }

  public async updateMachineStatus(
    id: number,
    statusData: IMachineStatusUpdate
  ): Promise<ILaundryMachine | null> {
    // Check if machine exists
    const existingMachine = await this.laundryMachineModel.getMachineById(id);
    if (!existingMachine) {
      throw new Error('Machine not found');
    }

    return this.laundryMachineModel.updateMachineStatus(id, statusData);
  }

  public async toggleMachinePower(
    id: number,
    isOn: boolean
  ): Promise<ILaundryMachine | null> {
    // Check if machine exists
    const existingMachine = await this.laundryMachineModel.getMachineById(id);
    if (!existingMachine) {
      throw new Error('Machine not found');
    }

    return this.laundryMachineModel.toggleMachinePower(id, isOn);
  }

  public async deleteMachine(
    id: number,
    hardDelete: boolean = false
  ): Promise<boolean> {
    // Check if machine exists
    const existingMachine = await this.laundryMachineModel.getMachineById(id);
    if (!existingMachine) {
      throw new Error('Machine not found');
    }

    if (hardDelete) {
      return this.laundryMachineModel.hardDeleteMachine(id);
    }
    return this.laundryMachineModel.softDeleteMachine(id);
  }
}
