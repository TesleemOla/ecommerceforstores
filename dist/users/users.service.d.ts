import { OnModuleInit } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserRole } from '../common/enums/role.enum';
import { ConfigService } from '@nestjs/config';
export declare class UsersService implements OnModuleInit {
    private readonly userModel;
    private readonly configService;
    constructor(userModel: Model<UserDocument>, configService: ConfigService);
    onModuleInit(): Promise<void>;
    createUser(payload: {
        email: string;
        password: string;
        fullName: string;
        role: UserRole;
        store?: Types.ObjectId | null;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    attachStore(userId: string, storeId: Types.ObjectId): Promise<void>;
    createDefaultSuperAdmin(): Promise<void>;
}
