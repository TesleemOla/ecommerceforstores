"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const store_schema_1 = require("./schemas/store.schema");
const users_service_1 = require("../users/users.service");
let StoresService = class StoresService {
    storeModel;
    usersService;
    constructor(storeModel, usersService) {
        this.storeModel = storeModel;
        this.usersService = usersService;
    }
    async create(ownerId, dto) {
        const ownerObjectId = new mongoose_2.Types.ObjectId(ownerId);
        const existingStore = await this.storeModel
            .findOne({ owner: ownerObjectId })
            .exec();
        if (existingStore) {
            throw new common_1.BadRequestException('Store already created for this owner');
        }
        const store = await this.storeModel.create({
            ...dto,
            owner: ownerObjectId,
        });
        await this.usersService.attachStore(ownerId, store._id);
        return store;
    }
    async findAll(status) {
        const filter = status ? { status } : {};
        return this.storeModel.find(filter).populate('owner').exec();
    }
    async findOne(storeId) {
        const store = await this.storeModel.findById(storeId).exec();
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        return store;
    }
    async updateStatus(storeId, approverId, dto) {
        const store = await this.storeModel
            .findByIdAndUpdate(storeId, {
            $set: {
                status: dto.status,
                approvedBy: new mongoose_2.Types.ObjectId(approverId),
            },
        }, { new: true })
            .exec();
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        return store;
    }
    async getOwnerStore(ownerId) {
        return this.storeModel.findOne({ owner: ownerId }).exec();
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(store_schema_1.Store.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService])
], StoresService);
//# sourceMappingURL=stores.service.js.map