import { UniversityModel } from '../models/university.model';
import {
  IUniversity,
  IUniversityCreate,
  IUniversityUpdate,
} from '../interfaces/university.interface';

export class UniversityService {
  private universityModel = new UniversityModel();

  public async getAllUniversities(): Promise<IUniversity[]> {
    return this.universityModel.getAllUniversities();
  }

  public async getUniversityById(id: number): Promise<IUniversity | null> {
    return this.universityModel.getUniversityById(id);
  }

  public async createUniversity(
    universityData: IUniversityCreate
  ): Promise<IUniversity> {
    return this.universityModel.createUniversity(universityData);
  }

  public async updateUniversity(
    id: number,
    universityData: IUniversityUpdate
  ): Promise<IUniversity | null> {
    return this.universityModel.updateUniversity(id, universityData);
  }

  public async softDeleteUniversity(id: number): Promise<boolean> {
    return this.universityModel.softDeleteUniversity(id);
  }

  public async hardDeleteUniversity(id: number): Promise<boolean> {
    return this.universityModel.hardDeleteUniversity(id);
  }
}
