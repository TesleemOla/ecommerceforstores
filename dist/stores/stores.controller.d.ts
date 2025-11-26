import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import * as authenticatedUserInterface from '../common/interfaces/authenticated-user.interface';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    createStore(user: authenticatedUserInterface.AuthenticatedUser, dto: CreateStoreDto): Promise<import("./schemas/store.schema").Store>;
    listActiveStores(): Promise<import("./schemas/store.schema").Store[]>;
    listPendingStores(): Promise<import("./schemas/store.schema").Store[]>;
    updateStoreStatus(storeId: string, admin: authenticatedUserInterface.AuthenticatedUser, dto: UpdateStoreStatusDto): Promise<import("./schemas/store.schema").Store>;
}
