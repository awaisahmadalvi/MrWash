import { LaundryHallModel } from '../models/laundryHall.model';
import {
  ILaundryHall,
  ILaundryHallCreate,
  ILaundryHallUpdate,
} from '../interfaces/laundryHall.interface';

export class LaundryHallService {
  private laundryHallModel = new LaundryHallModel();

  public async getAllHalls(): Promise<ILaundryHall[]> {
    return this.laundryHallModel.getAllHalls();
  }

  public async getHallById(id: number): Promise<ILaundryHall | null> {
    return this.laundryHallModel.getHallById(id);
  }

  public async getHallsByUniversity(uid: number): Promise<ILaundryHall[]> {
    return this.laundryHallModel.getHallsByUniversity(uid);
  }

  public async createHall(hallData: ILaundryHallCreate): Promise<ILaundryHall> {
    // Validate required fields
    if (
      !hallData.UID ||
      !hallData.HALLNAME ||
      !hallData.Address ||
      hallData.GPSLT === undefined ||
      hallData.GPSLG === undefined ||
      hallData.WaitingTime === undefined
    ) {
      throw new Error('All required fields must be provided');
    }

    return this.laundryHallModel.createHall(hallData);
  }

  public async updateHall(
    id: number,
    hallData: ILaundryHallUpdate
  ): Promise<ILaundryHall | null> {
    // Check if hall exists
    const existingHall = await this.laundryHallModel.getHallById(id);
    if (!existingHall) {
      throw new Error('Laundry hall not found');
    }

    return this.laundryHallModel.updateHall(id, hallData);
  }

  public async deleteHall(
    id: number,
    hardDelete: boolean = false
  ): Promise<boolean> {
    // Check if hall exists
    const existingHall = await this.laundryHallModel.getHallById(id);
    if (!existingHall) {
      throw new Error('Laundry hall not found');
    }

    if (hardDelete) {
      return this.laundryHallModel.hardDeleteHall(id);
    }
    return this.laundryHallModel.softDeleteHall(id);
  }
}
