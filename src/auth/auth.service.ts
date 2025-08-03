import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validates user credentials and returns JWT if successful
  async login(email: string, password: string): 
  Promise<{ success: true; token: string } | { success: false; error: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { success: false, error: 'Invalid email or password' };

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return { success: false, error: 'Invalid email or password' };

    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { success: true, token };
  }
}
