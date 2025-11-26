import { OrderStatus } from '../../common/enums/order-status.enum';
declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    storeId: string;
    items: OrderItemDto[];
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
export {};
