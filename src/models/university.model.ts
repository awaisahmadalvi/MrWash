import { pool } from '../config/database';
import {
  IUniversity,
  IUniversityCreate,
  IUniversityUpdate,
} from '../interfaces/university.interface';

export class UniversityModel {
  async getAllUniversities(): Promise<IUniversity[]> {
    const result = await pool
      .request()
      .query('SELECT * FROM University WHERE isDeleted = 0');
    return result.recordset;
  }

  async getUniversityById(id: number): Promise<IUniversity | null> {
    const result = await pool
      .request()
      .input('UID', id)
      .query('SELECT * FROM University WHERE UID = @UID AND isDeleted = 0');
    return result.recordset[0] || null;
  }

  async createUniversity(
    universityData: IUniversityCreate
  ): Promise<IUniversity> {
    const result = await pool
      .request()
      .input('University', universityData.University)
      .input('otherInfo', universityData.otherInfo || null)
      .input('UniAddress', universityData.UniAddress || null).query(`
        INSERT INTO University (University, otherInfo, UniAddress)
        OUTPUT INSERTED.*
        VALUES (@University, @otherInfo, @UniAddress)
      `);
    return result.recordset[0];
  }

  async updateUniversity(
    id: number,
    universityData: IUniversityUpdate
  ): Promise<IUniversity | null> {
    const result = await pool
      .request()
      .input('UID', id)
      .input('University', universityData.University || null)
      .input('isDeleted', universityData.isDeleted || 0)
      .input('isDeletedDate', universityData.isDeletedDate || null)
      .input('otherInfo', universityData.otherInfo || null)
      .input('UniAddress', universityData.UniAddress || null).query(`
        UPDATE University SET
          University = COALESCE(@University, University),
          isDeleted = COALESCE(@isDeleted, isDeleted),
          isDeletedDate = COALESCE(@isDeletedDate, isDeletedDate),
          otherInfo = COALESCE(@otherInfo, otherInfo),
          UniAddress = COALESCE(@UniAddress, UniAddress)
        OUTPUT INSERTED.*
        WHERE UID = @UID
      `);
    return result.recordset[0] || null;
  }

  async softDeleteUniversity(id: number): Promise<boolean> {
    const result = await pool.request().input('UID', id).query(`
        UPDATE University SET
          isDeleted = 1,
          isDeletedDate = GETDATE()
        WHERE UID = @UID
      `);
    return result.rowsAffected[0] > 0;
  }

  async hardDeleteUniversity(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('UID', id)
      .query('DELETE FROM University WHERE UID = @UID');
    return result.rowsAffected[0] > 0;
  }
}
