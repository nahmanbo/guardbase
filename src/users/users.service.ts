import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // Registers a new user with hashed password and email uniqueness check
  async signup(dto: CreateUserDto): 
  Promise<{ success: true; data: User } | { success: false; error: string }> {
    try {
      const existing = await this.repo.findOneBy({ email: dto.email });
      if (existing)
        return { success: false, error: 'Email already in use' };

      const hashed = await bcrypt.hash(dto.password, 10);
      const user = this.repo.create({ ...dto, password: hashed });
      const saved = await this.repo.save(user);
      return { success: true, data: saved };
    } catch (err) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  }

  // Authenticates a user by verifying credentials
  async login(dto: LoginUserDto): 
  Promise<{ success: true; user: User } | { success: false; error: string }> {
    const user = await this.repo.findOneBy({ email: dto.email });
    if (!user)
      return { success: false, error: 'User not found' };

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match)
      return { success: false, error: 'Invalid credentials' };

    return { success: true, user };
  }
}
