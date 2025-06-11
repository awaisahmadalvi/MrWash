import { pool } from '../config/database';
import {
  ILaundryUser,
  ILaundryUserCreate,
  ILaundryUserUpdate,
} from '../interfaces/laundryUser.interface';
import bcrypt from 'bcryptjs';

export class LaundryUserModel {
  async getAllUsers(): Promise<ILaundryUser[]> {
    const result = await pool
      .request()
      .query(
        'SELECT * FROM LaundryUser WHERE isDeleted IS NULL OR isDeleted = 0'
      );
    return result.recordset;
  }

  async getUserById(id: number): Promise<ILaundryUser | null> {
    const result = await pool
      .request()
      .input('UserID', id)
      .query(
        'SELECT * FROM LaundryUser WHERE UserID = @UserID AND (isDeleted IS NULL OR isDeleted = 0)'
      );
    return result.recordset[0] || null;
  }

  async getUserByUsername(Username: string): Promise<ILaundryUser | null> {
    const result = await pool
      .request()
      .input('Username', Username)
      .query(
        'SELECT * FROM LaundryUser WHERE Username = @Username AND (isDeleted IS NULL OR isDeleted = 0)'
      );
    return result.recordset[0] || null;
  }

  async createUser(userData: ILaundryUserCreate): Promise<ILaundryUser> {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    const hashedPass = await bcrypt.hash(userData.Password, salt); // Hash the password

    const result = await pool
      .request()
      .input('Username', userData.Username)
      .input('Password', hashedPass)
      .input('firstname', userData.firstname || null)
      .input('lastname', userData.lastname || null)
      .input('address', userData.address || null)
      .input('accountType', userData.accountType || null)
      .input('UserDegree', userData.UserDegree || null)
      .input('cellNo', userData.cellNo || null)
      .input('IMEI', userData.IMEI || null)
      .input('cnic', userData.cnic || null)
      .input('email', userData.email || null)
      .input('otherInfo', userData.otherInfo || null).query(`
                INSERT INTO LaundryUser (
                    Username, Password, firstname, lastname, address, 
                    accountType, UserDegree, cellNo, IMEI, cnic, email, otherInfo
                )
                OUTPUT INSERTED.*
                VALUES (
                    @Username, @Password, @firstname, @lastname, @address,
                    @accountType, @UserDegree, @cellNo, @IMEI, @cnic, @email, @otherInfo
                )
            `);
    return result.recordset[0];
  }

  async updateUser(
    id: number,
    userData: ILaundryUserUpdate
  ): Promise<ILaundryUser | null> {
    let hashedPass: string | null = null; // Declare hashedPass outside the if block

    // Only hash the password if it's provided in the update data
    if (userData.Password != null) {
      const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
      hashedPass = await bcrypt.hash(userData.Password, salt); // Hash the password
    }
    const result = await pool
      .request()
      .input('UserID', id)
      .input('Username', userData.Username || null)
      .input('Password', hashedPass)
      .input('firstname', userData.firstname || null)
      .input('lastname', userData.lastname || null)
      .input('address', userData.address || null)
      .input('accountType', userData.accountType || null)
      .input('UserDegree', userData.UserDegree || null)
      .input('isDeleted', userData.isDeleted || null)
      .input('cellNo', userData.cellNo || null)
      .input('IMEI', userData.IMEI || null)
      .input('cnic', userData.cnic || null)
      .input('email', userData.email || null)
      .input('otherInfo', userData.otherInfo || null).query(`
                UPDATE LaundryUser SET
                    Username = COALESCE(@Username, Username),
                    Password = COALESCE(@Password, Password),
                    firstname = COALESCE(@firstname, firstname),
                    lastname = COALESCE(@lastname, lastname),
                    address = COALESCE(@address, address),
                    accountType = COALESCE(@accountType, accountType),
                    UserDegree = COALESCE(@UserDegree, UserDegree),
                    isDeleted = COALESCE(@isDeleted, isDeleted),
                    cellNo = COALESCE(@cellNo, cellNo),
                    IMEI = COALESCE(@IMEI, IMEI),
                    cnic = COALESCE(@cnic, cnic),
                    email = COALESCE(@email, email),
                    otherInfo = COALESCE(@otherInfo, otherInfo)
                OUTPUT INSERTED.*
                WHERE UserID = @UserID
            `);
    return result.recordset[0] || null;
  }

  async softDeleteUser(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('UserID', id)
      .query('UPDATE LaundryUser SET isDeleted = 1 WHERE UserID = @UserID');
    return result.rowsAffected[0] > 0;
  }

  async hardDeleteUser(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('UserID', id)
      .query('DELETE FROM LaundryUser WHERE UserID = @UserID');
    return result.rowsAffected[0] > 0;
  }
}
