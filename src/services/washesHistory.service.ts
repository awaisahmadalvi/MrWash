import { WashesHistoryModel } from '../models/washesHistory.model';
import {
  IWashesHistory,
  IWashesHistoryCreate,
  IWashesHistoryUpdate,
  IWashStatusUpdate,
} from '../interfaces/washesHistory.interface';

export class WashesHistoryService {
  private washesHistoryModel = new WashesHistoryModel();

  public async getAllWashes(): Promise<IWashesHistory[]> {
    return this.washesHistoryModel.getAllWashes();
  }

  public async getWashesByUser(userId: number): Promise<IWashesHistory[]> {
    return this.washesHistoryModel.getWashesByUser(userId);
  }

  public async getWashesByMachine(
    machineId: number
  ): Promise<IWashesHistory[]> {
    return this.washesHistoryModel.getWashesByMachine(machineId);
  }

  public async getWashById(id: number): Promise<IWashesHistory | null> {
    return this.washesHistoryModel.getWashById(id);
  }

  public async createWash(
    washData: IWashesHistoryCreate
  ): Promise<IWashesHistory> {
    // Validate required fields
    if (!washData.SLID || !washData.MachineId || !washData.UserId) {
      throw new Error('SLID, MachineId, and UserId are required');
    }

    return this.washesHistoryModel.createWash(washData);
  }

  public async updateWash(
    id: number,
    washData: IWashesHistoryUpdate
  ): Promise<IWashesHistory | null> {
    // Check if wash exists
    const existingWash = await this.washesHistoryModel.getWashById(id);
    if (!existingWash) {
      throw new Error('Wash record not found');
    }

    return this.washesHistoryModel.updateWash(id, washData);
  }

  public async updateWashStatus(
    id: number,
    statusData: IWashStatusUpdate
  ): Promise<IWashesHistory | null> {
    // Check if wash exists
    const existingWash = await this.washesHistoryModel.getWashById(id);
    if (!existingWash) {
      throw new Error('Wash record not found');
    }

    return this.washesHistoryModel.updateWashStatus(id, statusData);
  }

  public async deleteWash(
    id: number,
    hardDelete: boolean = false
  ): Promise<boolean> {
    // Check if wash exists
    const existingWash = await this.washesHistoryModel.getWashById(id);
    if (!existingWash) {
      throw new Error('Wash record not found');
    }

    if (hardDelete) {
      return this.washesHistoryModel.hardDeleteWash(id);
    }
    return this.washesHistoryModel.softDeleteWash(id);
  }
}
