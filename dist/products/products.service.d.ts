import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StoresService } from '../stores/stores.service';
export declare class ProductsService {
    private readonly productModel;
    private readonly storesService;
    constructor(productModel: Model<ProductDocument>, storesService: StoresService);
    create(ownerId: string, dto: CreateProductDto): Promise<Product>;
    update(productId: string, ownerId: string, dto: UpdateProductDto): Promise<Product>;
    findAll(storeId?: string): Promise<Product[]>;
    findById(productId: string): Promise<Product>;
    decrementStock(productId: string, quantity: number): Promise<void>;
    private ensureStoreAccess;
}
