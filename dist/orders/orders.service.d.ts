import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { StoresService } from '../stores/stores.service';
export declare class OrdersService {
    private readonly orderModel;
    private readonly productsService;
    private readonly storesService;
    constructor(orderModel: Model<OrderDocument>, productsService: ProductsService, storesService: StoresService);
    create(customerId: string, dto: CreateOrderDto): Promise<Order>;
    findCustomerOrders(customerId: string): Promise<Order[]>;
    findStoreOrders(ownerId: string): Promise<Order[]>;
    updateStatus(orderId: string, ownerId: string, dto: UpdateOrderStatusDto): Promise<Order>;
}
