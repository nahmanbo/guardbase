import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  // Returns all users
  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  // Returns user by ID
  async findById(id: number): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user)
      throw new NotFoundException('User not found');
    return user;
  }

  // Updates user by ID
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.repo.save(user);
  }

  // Deletes user by ID
  async remove(id: number): Promise<{ success: true }> {
    const user = await this.findById(id);
    await this.repo.remove(user);
    return { success: true };
  }

  // Finds user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }
}
