import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin } from './admin.schema';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async onModuleInit() {
    const existingUser = await this.adminModel
      .findOne()
      .where('username', 'admin');

    if (!existingUser) {
      this.createAdmin('admin', 'admin');
    }
  }

  async createAdmin(username: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new this.adminModel({ username, password: hashedPassword });
    return admin.save();
  }

  async findByUsername(username: string): Promise<Admin | undefined> {
    return this.adminModel.findOne({ username }).exec();
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
