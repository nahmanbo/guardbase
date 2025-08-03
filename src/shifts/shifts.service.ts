import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './shift.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly repo: Repository<Shift>,
  ) {}

  // Creates a new shift
  async create(dto: CreateShiftDto): Promise<Shift> {
    const shift = this.repo.create(dto);
    return await this.repo.save(shift);
  }

  // Returns all shifts
  async findAll(): Promise<Shift[]> {
    return await this.repo.find();
  }

  // Returns a shift by ID
  async findOne(id: number): Promise<Shift> {
    const shift = await this.repo.findOne({ where: { id } });
    if (!shift)
      throw new NotFoundException('Shift not found');
    return shift;
  }

  // Updates a shift by ID
  async update(id: number, dto: UpdateShiftDto): Promise<Shift> {
    const shift = await this.findOne(id);
    Object.assign(shift, dto);
    return await this.repo.save(shift);
  }

  // Deletes a shift by ID
  async remove(id: number): Promise<void> {
    const shift = await this.findOne(id);
    await this.repo.remove(shift);
  }
}
