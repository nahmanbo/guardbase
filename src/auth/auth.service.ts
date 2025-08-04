import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validates user credentials and returns JWT token
  async login(dto: LoginUserDto): 
  Promise<{ success: true; token: string } | { success: false; error: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user)
      return { success: false, error: 'User not found' };

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match)
      return { success: false, error: 'Invalid credentials' };

    const payload = {
      sub: user.id,
      name: user.name,   
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);
    return { success: true, token };
  }
}
