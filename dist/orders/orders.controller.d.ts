import { OrdersService } from './orders.service';
import * as authenticatedUserInterface from '../common/interfaces/authenticated-user.interface';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(customer: authenticatedUserInterface.AuthenticatedUser, dto: CreateOrderDto): Promise<import("./schemas/order.schema").Order>;
    myOrders(customer: authenticatedUserInterface.AuthenticatedUser): Promise<import("./schemas/order.schema").Order[]>;
    storeOrders(owner: authenticatedUserInterface.AuthenticatedUser): Promise<import("./schemas/order.schema").Order[]>;
    updateStatus(orderId: string, owner: authenticatedUserInterface.AuthenticatedUser, dto: UpdateOrderStatusDto): Promise<import("./schemas/order.schema").Order>;
}
