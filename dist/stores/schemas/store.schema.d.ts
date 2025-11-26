import { Document, Types } from 'mongoose';
import { StoreStatus } from '../../common/enums/store-status.enum';
export type StoreDocument = Store & Document;
export declare class Store {
    name: string;
    description?: string;
    owner: Types.ObjectId;
    status: StoreStatus;
    approvedBy?: Types.ObjectId | null;
}
export declare const StoreSchema: import("mongoose").Schema<Store, import("mongoose").Model<Store, any, any, any, Document<unknown, any, Store, any, {}> & Store & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Store, Document<unknown, {}, import("mongoose").FlatRecord<Store>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Store> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
