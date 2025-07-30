import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './shift.entity';
import { CreateShiftDto } from './dto/create-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly repo: Repository<Shift>,
  ) {}

  // Creates a new shift and returns success or error response
  async create(createShiftDto: CreateShiftDto): 
  Promise<{ success: true; data: Shift } | { success: false; error: string }> {
    try {
      const shift = this.repo.create(createShiftDto);
      const saved = await this.repo.save(shift);
      return { success: true, data: saved };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to create shift' };
    }
  }
}
