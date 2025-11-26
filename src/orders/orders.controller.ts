import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import * as authenticatedUserInterface from '../common/interfaces/authenticated-user.interface';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.Customer)
  @Post()
  createOrder(
    @CurrentUser() customer: authenticatedUserInterface.AuthenticatedUser,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(customer.id, dto);
  }

  @Roles(UserRole.Customer)
  @Get('me')
  myOrders(@CurrentUser() customer: authenticatedUserInterface.AuthenticatedUser) {
    return this.ordersService.findCustomerOrders(customer.id);
  }

  @Roles(UserRole.StoreOwner)
  @Get('store')
  storeOrders(@CurrentUser() owner: authenticatedUserInterface.AuthenticatedUser) {
    return this.ordersService.findStoreOrders(owner.id);
  }

  @Roles(UserRole.StoreOwner)
  @Patch(':id/status')
  updateStatus(
    @Param('id') orderId: string,
    @CurrentUser() owner: authenticatedUserInterface.AuthenticatedUser,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(orderId, owner.id, dto);
  }
}
