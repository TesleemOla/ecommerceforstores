import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { StoresService } from '../stores/stores.service';
import { StoreStatus } from '../common/enums/store-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly productsService: ProductsService,
    private readonly storesService: StoresService,
  ) {}

  async create(customerId: string, dto: CreateOrderDto): Promise<Order> {
    const store = await this.storesService.findOne(dto.storeId);

    if (store.status !== StoreStatus.Approved) {
      throw new BadRequestException('Store is not accepting orders yet');
    }

    const orderItems: {
      product: Types.ObjectId;
      quantity: number;
      unitPrice: number;
    }[] = [];
    let total = 0;

    for (const item of dto.items) {
      const product = await this.productsService.findById(item.productId);

      if (product.store.toString() !== dto.storeId.toString()) {
        throw new BadRequestException('Product does not belong to this store');
      }

      await this.productsService.decrementStock(item.productId, item.quantity);

      orderItems.push({
        product: new Types.ObjectId(item.productId),
        quantity: item.quantity,
        unitPrice: product.price,
      });

      total += product.price * item.quantity;
    }

    return this.orderModel.create({
      customer: customerId,
      store: new Types.ObjectId(dto.storeId),
      items: orderItems,
      total,
    });
  }

  async findCustomerOrders(customerId: string): Promise<Order[]> {
    return this.orderModel
      .find({ customer: customerId })
      .populate('items.product')
      .exec();
  }

  async findStoreOrders(ownerId: string): Promise<Order[]> {
    const store = await this.storesService.getOwnerStore(ownerId);
    if (!store) {
      throw new NotFoundException('Store not found for owner');
    }

    return this.orderModel.find({ store: ownerId }).populate('customer').exec();
  }

  async updateStatus(
    orderId: string,
    ownerId: string,
    dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const store = await this.storesService.getOwnerStore(ownerId);
    if (!store) {
      throw new ForbiddenException('Owner is not associated with a store');
    }

    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.store.toString() !== ownerId) {
      throw new ForbiddenException('Cannot update orders from another store');
    }

    order.status = dto.status;
    return order.save();
  }
}
