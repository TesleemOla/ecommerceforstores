import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterStoreOwnerDto } from './dto/register-store-owner.dto';
import { UserRole } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerCustomer(dto: RegisterCustomerDto) {
    await this.ensureEmailIsFree(dto.email);
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createUser({
      email: dto.email,
      password: hashed,
      fullName: dto.fullName,
      role: UserRole.Customer,
    });
    return this.buildAuthResponse(user);
  }

  async registerStoreOwner(dto: RegisterStoreOwnerDto) {
    await this.ensureEmailIsFree(dto.email);
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createUser({
      email: dto.email,
      password: hashed,
      fullName: dto.fullName,
      role: UserRole.StoreOwner,
    });
    return this.buildAuthResponse(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  login(user: User) {
    return this.buildAuthResponse(user);
  }

  private async ensureEmailIsFree(email: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
  }

  private buildAuthResponse(user: User) {
    const payload: JwtPayload = {
      sub: user.fullName,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '7d' }),
      user,
    };
  }
}
