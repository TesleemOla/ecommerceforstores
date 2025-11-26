import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../common/enums/order-status.enum';

class OrderItemDto {
  @IsMongoId()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsMongoId()
  storeId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
