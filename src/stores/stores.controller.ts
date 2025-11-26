import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import * as authenticatedUserInterface from '../common/interfaces/authenticated-user.interface';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';
import { StoreStatus } from '../common/enums/store-status.enum';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.StoreOwner)
  @Post()
  createStore(
    @CurrentUser() user: authenticatedUserInterface.AuthenticatedUser,
    @Body() dto: CreateStoreDto,
  ) {
    return this.storesService.create(user.id, dto);
  }

  @Get()
  listActiveStores() {
    return this.storesService.findAll(StoreStatus.Approved);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  @Get('pending')
  listPendingStores() {
    return this.storesService.findAll(StoreStatus.Pending);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  @Patch(':id/status')
  updateStoreStatus(
    @Param('id') storeId: string,
    @CurrentUser() admin: authenticatedUserInterface.AuthenticatedUser,
    @Body() dto: UpdateStoreStatusDto,
  ) {
    return this.storesService.updateStatus(storeId, admin.id, dto);
  }
}
