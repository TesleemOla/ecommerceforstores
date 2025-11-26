import { Model } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreStatus } from '../common/enums/store-status.enum';
import { UsersService } from '../users/users.service';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';
export declare class StoresService {
    private readonly storeModel;
    private readonly usersService;
    constructor(storeModel: Model<StoreDocument>, usersService: UsersService);
    create(ownerId: string, dto: CreateStoreDto): Promise<Store>;
    findAll(status?: StoreStatus): Promise<Store[]>;
    findOne(storeId: string): Promise<Store>;
    updateStatus(storeId: string, approverId: string, dto: UpdateStoreStatusDto): Promise<Store>;
    getOwnerStore(ownerId: string): Promise<Store | null>;
}
