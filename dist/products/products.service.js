"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const stores_service_1 = require("../stores/stores.service");
const store_status_enum_1 = require("../common/enums/store-status.enum");
let ProductsService = class ProductsService {
    productModel;
    storesService;
    constructor(productModel, storesService) {
        this.productModel = productModel;
        this.storesService = storesService;
    }
    async create(ownerId, dto) {
        const store = await this.storesService.findOne(dto.storeId);
        this.ensureStoreAccess(ownerId, store.owner.toString());
        if (store.status !== store_status_enum_1.StoreStatus.Approved) {
            throw new common_1.ForbiddenException('Store must be approved before listing products');
        }
        return this.productModel.create({
            ...dto,
            store: dto.storeId,
        });
    }
    async update(productId, ownerId, dto) {
        const product = await this.productModel.findById(productId).exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const store = await this.storesService.findOne(product.store.toString());
        this.ensureStoreAccess(ownerId, store.owner.toString());
        Object.assign(product, dto);
        return product.save();
    }
    async findAll(storeId) {
        const filter = storeId ? { store: storeId } : {};
        return this.productModel.find(filter).populate('store').exec();
    }
    async findById(productId) {
        const product = await this.productModel.findById(productId).exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async decrementStock(productId, quantity) {
        const product = await this.productModel.findById(productId).exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.stock < quantity) {
            throw new common_1.ForbiddenException('Insufficient product stock');
        }
        product.stock -= quantity;
        await product.save();
    }
    ensureStoreAccess(ownerId, storeOwnerId) {
        if (ownerId !== storeOwnerId) {
            throw new common_1.ForbiddenException('You do not own this store');
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        stores_service_1.StoresService])
], ProductsService);
//# sourceMappingURL=products.service.js.map