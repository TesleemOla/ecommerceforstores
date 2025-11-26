import { AuthService } from './auth.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterStoreOwnerDto } from './dto/register-store-owner.dto';
import { User } from '../users/schemas/user.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerCustomer(dto: RegisterCustomerDto): Promise<{
        accessToken: string;
        user: User;
    }>;
    registerStoreOwner(dto: RegisterStoreOwnerDto): Promise<{
        accessToken: string;
        user: User;
    }>;
    login(req: {
        user: User;
    }): {
        accessToken: string;
        user: User;
    };
}
