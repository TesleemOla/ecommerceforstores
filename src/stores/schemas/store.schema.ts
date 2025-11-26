import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StoreStatus } from '../../common/enums/store-status.enum';

export type StoreDocument = Store & Document;

@Schema({ timestamps: true })
export class Store {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner!: Types.ObjectId;

  @Prop({
    enum: StoreStatus,
    default: StoreStatus.Pending,
    required: true,
  })
  status!: StoreStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  approvedBy?: Types.ObjectId | null;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
