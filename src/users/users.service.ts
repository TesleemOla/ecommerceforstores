import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserRole } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createDefaultSuperAdmin();
  }

  async createUser(payload: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    store?: Types.ObjectId | null;
  }): Promise<User> {
    const normalizedEmail = payload.email.toLowerCase();
    return this.userModel.create({
      ...payload,
      email: normalizedEmail,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async attachStore(userId: string, storeId: Types.ObjectId) {
    await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $set: { store: storeId },
        },
        { new: true },
      )
      .exec();
  }

  async createDefaultSuperAdmin(): Promise<void> {
    const email = this.configService.getOrThrow<string>(
      'defaultSuperAdminEmail',
    );
    const password = this.configService.getOrThrow<string>(
      'defaultSuperAdminPassword',
    );

    const existing = await this.findByEmail(email);
    if (existing) {
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.createUser({
      email,
      password: hashed,
      fullName: 'Platform Super Admin',
      role: UserRole.SuperAdmin,
    });
  }
}
