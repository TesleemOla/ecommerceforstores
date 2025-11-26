import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StoresService } from '../stores/stores.service';
import { StoreStatus } from '../common/enums/store-status.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly storesService: StoresService,
  ) {}

  async create(ownerId: string, dto: CreateProductDto): Promise<Product> {
    const store = await this.storesService.findOne(dto.storeId);
    this.ensureStoreAccess(ownerId, store.owner.toString());

    if (store.status !== StoreStatus.Approved) {
      throw new ForbiddenException(
        'Store must be approved before listing products',
      );
    }

    return this.productModel.create({
      ...dto,
      store: dto.storeId,
    });
  }

  async update(
    productId: string,
    ownerId: string,
    dto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const store = await this.storesService.findOne(product.store.toString());
    this.ensureStoreAccess(ownerId, store.owner.toString());

    Object.assign(product, dto);
    return product.save();
  }

  async findAll(storeId?: string): Promise<Product[]> {
    const filter = storeId ? { store: storeId } : {};
    return this.productModel.find(filter).populate('store').exec();
  }

  async findById(productId: string): Promise<Product> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async decrementStock(productId: string, quantity: number) {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new ForbiddenException('Insufficient product stock');
    }

    product.stock -= quantity;
    await product.save();
  }

  private ensureStoreAccess(ownerId: string, storeOwnerId: string) {
    if (ownerId !== storeOwnerId) {
      throw new ForbiddenException('You do not own this store');
    }
  }
}
