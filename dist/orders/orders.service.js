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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const products_service_1 = require("../products/products.service");
const stores_service_1 = require("../stores/stores.service");
const store_status_enum_1 = require("../common/enums/store-status.enum");
let OrdersService = class OrdersService {
    orderModel;
    productsService;
    storesService;
    constructor(orderModel, productsService, storesService) {
        this.orderModel = orderModel;
        this.productsService = productsService;
        this.storesService = storesService;
    }
    async create(customerId, dto) {
        const store = await this.storesService.findOne(dto.storeId);
        if (store.status !== store_status_enum_1.StoreStatus.Approved) {
            throw new common_1.BadRequestException('Store is not accepting orders yet');
        }
        const orderItems = [];
        let total = 0;
        for (const item of dto.items) {
            const product = await this.productsService.findById(item.productId);
            if (product.store.toString() !== store._id.toString()) {
                throw new common_1.BadRequestException('Product does not belong to this store');
            }
            await this.productsService.decrementStock(product.id, item.quantity);
            orderItems.push({
                product: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
            });
            total += product.price * item.quantity;
        }
        return this.orderModel.create({
            customer: customerId,
            store: store.id,
            items: orderItems,
            total,
        });
    }
    async findCustomerOrders(customerId) {
        return this.orderModel
            .find({ customer: customerId })
            .populate('items.product')
            .exec();
    }
    async findStoreOrders(ownerId) {
        const store = await this.storesService.getOwnerStore(ownerId);
        if (!store) {
            throw new common_1.NotFoundException('Store not found for owner');
        }
        return this.orderModel
            .find({ store: store.id })
            .populate('customer')
            .exec();
    }
    async updateStatus(orderId, ownerId, dto) {
        const store = await this.storesService.getOwnerStore(ownerId);
        if (!store) {
            throw new common_1.ForbiddenException('Owner is not associated with a store');
        }
        const order = await this.orderModel.findById(orderId).exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.store.toString() !== store.id) {
            throw new common_1.ForbiddenException('Cannot update orders from another store');
        }
        order.status = dto.status;
        return order.save();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService,
        stores_service_1.StoresService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map