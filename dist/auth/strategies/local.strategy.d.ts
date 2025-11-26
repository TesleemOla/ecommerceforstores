import { AuthService } from '../auth.service';
import { User } from '../../users/schemas/user.schema';
declare const LocalStrategy_base: new (...args: any) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<User>;
}
export {};
