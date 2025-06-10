import { pool } from '../config/database';
import { IUser } from '../interfaces/user.interface';

export class UserModel {
  async getAllUsers(): Promise<IUser[]> {
    const result = await pool.request().query('SELECT * FROM Users');
    return result.recordset;
  }

  async getUserById(id: number): Promise<IUser | null> {
    const result = await pool
      .request()
      .input('id', id)
      .query('SELECT * FROM Users WHERE id = @id');

    return result.recordset[0] || null;
  }

  async createUser(user: IUser): Promise<IUser> {
    const result = await pool
      .request()
      .input('name', user.name)
      .input('email', user.email)
      .query(
        'INSERT INTO Users (name, email) OUTPUT INSERTED.* VALUES (@name, @email)'
      );

    return result.recordset[0];
  }

  async updateUser(id: number, user: IUser): Promise<IUser | null> {
    const result = await pool
      .request()
      .input('id', id)
      .input('name', user.name)
      .input('email', user.email)
      .query(
        'UPDATE Users SET name = @name, email = @email OUTPUT INSERTED.* WHERE id = @id'
      );

    return result.recordset[0] || null;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await pool
      .request()
      .input('id', id)
      .query('DELETE FROM Users WHERE id = @id');

    return result.rowsAffected[0] > 0;
  }
}
