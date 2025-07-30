import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // Creates a new user and returns success or error response
  async create(createUserDto: CreateUserDto): 
  Promise<{ success: true; data: User }|{ success: false; error: string }> {
    try {
      const user = this.repo.create(createUserDto);
      const saved = await this.repo.save(user);
      return { success: true, data: saved };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to create user' };
    }
  }
}
