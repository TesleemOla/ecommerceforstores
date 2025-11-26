import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreStatus } from '../common/enums/store-status.enum';
import { UsersService } from '../users/users.service';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<StoreDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(ownerId: string, dto: CreateStoreDto): Promise<Store> {
    const ownerObjectId = new Types.ObjectId(ownerId);
    const existingStore = await this.storeModel
      .findOne({ owner: ownerObjectId })
      .exec();

    if (existingStore) {
      throw new BadRequestException('Store already created for this owner');
    }

    const store = await this.storeModel.create({
      ...dto,
      owner: ownerObjectId,
    });

    await this.usersService.attachStore(ownerId, store._id);
    return store;
  }

  async findAll(status?: StoreStatus): Promise<Store[]> {
    const filter = status ? { status } : {};
    return this.storeModel.find(filter).populate('owner').exec();
  }

  async findOne(storeId: string): Promise<Store> {
    const store = await this.storeModel.findById(storeId).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async updateStatus(
    storeId: string,
    approverId: string,
    dto: UpdateStoreStatusDto,
  ): Promise<Store> {
    const store = await this.storeModel
      .findByIdAndUpdate(
        storeId,
        {
          $set: {
            status: dto.status,
            approvedBy: new Types.ObjectId(approverId),
          },
        },
        { new: true },
      )
      .exec();

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async getOwnerStore(ownerId: string): Promise<Store | null> {
    return this.storeModel.findOne({ owner: ownerId }).exec();
  }
}
