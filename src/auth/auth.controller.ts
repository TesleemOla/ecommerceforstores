import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterStoreOwnerDto } from './dto/register-store-owner.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { User } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/customer')
  registerCustomer(@Body() dto: RegisterCustomerDto) {
    return this.authService.registerCustomer(dto);
  }

  @Post('register/store-owner')
  registerStoreOwner(@Body() dto: RegisterStoreOwnerDto) {
    return this.authService.registerStoreOwner(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
