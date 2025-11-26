import { Document, Types } from 'mongoose';
import { OrderStatus } from '../../common/enums/order-status.enum';
export type OrderDocument = Order & Document;
export declare class OrderItem {
    product: Types.ObjectId;
    quantity: number;
    unitPrice: number;
}
export declare class Order {
    customer: Types.ObjectId;
    store: Types.ObjectId;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
