import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from '../../common/enums/order-status.enum';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product!: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true, min: 0 })
  unitPrice!: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customer!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Store', required: true })
  store!: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items!: OrderItem[];

  @Prop({ required: true, min: 0 })
  total!: number;

  @Prop({
    enum: OrderStatus,
    default: OrderStatus.Pending,
    required: true,
  })
  status!: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
