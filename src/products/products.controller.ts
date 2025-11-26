import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import * as authenticatedUserInterface from '../common/interfaces/authenticated-user.interface';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findProducts(@Query('storeId') storeId?: string) {
    return this.productsService.findAll(storeId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.StoreOwner)
  @Post()
  createProduct(
    @CurrentUser() owner: authenticatedUserInterface.AuthenticatedUser,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(owner.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.StoreOwner)
  @Patch(':id')
  updateProduct(
    @Param('id') productId: string,
    @CurrentUser() owner: authenticatedUserInterface.AuthenticatedUser,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(productId, owner.id, dto);
  }
}
