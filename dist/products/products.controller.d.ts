import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import * as authenticatedUserInterface from '../common/interfaces/authenticated-user.interface';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findProducts(storeId?: string): Promise<import("./schemas/product.schema").Product[]>;
    createProduct(owner: authenticatedUserInterface.AuthenticatedUser, dto: CreateProductDto): Promise<import("./schemas/product.schema").Product>;
    updateProduct(productId: string, owner: authenticatedUserInterface.AuthenticatedUser, dto: UpdateProductDto): Promise<import("./schemas/product.schema").Product>;
}
