import { IsEnum } from 'class-validator';
import { StoreStatus } from '../../common/enums/store-status.enum';

export class UpdateStoreStatusDto {
  @IsEnum(StoreStatus)
  status!: StoreStatus;
}
