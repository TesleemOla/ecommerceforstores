import { UsersService } from '../users/users.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterStoreOwnerDto } from './dto/register-store-owner.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    registerCustomer(dto: RegisterCustomerDto): Promise<{
        accessToken: any;
        user: User;
    }>;
    registerStoreOwner(dto: RegisterStoreOwnerDto): Promise<{
        accessToken: any;
        user: User;
    }>;
    validateUser(email: string, password: string): Promise<User>;
    login(user: User): {
        accessToken: any;
        user: User;
    };
    private ensureEmailIsFree;
    private buildAuthResponse;
}
