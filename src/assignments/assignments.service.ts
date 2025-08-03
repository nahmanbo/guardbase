import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { User } from '../users/user.entity';
import { Shift } from '../shifts/shift.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly repo: Repository<Assignment>,
  ) {}

  async create(dto: CreateAssignmentDto) {
    const assignment = this.repo.create({
      user: { id: dto.userId } as User,
      shift: { id: dto.shiftId } as Shift,
    });
    const saved = await this.repo.save(assignment);
    return { success: true, data: saved };
  }

  async findAll() {
    return this.repo.find({ relations: ['user', 'shift'] });
  }

  async findByUserId(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['user', 'shift'],
    });
  }

  async findById(id: number) {
    const found = await this.repo.findOne({
      where: { id },
      relations: ['user', 'shift'],
    });
    if (!found) throw new NotFoundException('Assignment not found');
    return found;
  }

  async update(id: number, dto: UpdateAssignmentDto) {
    const assignment = await this.findById(id);

    if (dto.userId) assignment.user = { id: dto.userId } as User;
    if (dto.shiftId) assignment.shift = { id: dto.shiftId } as Shift;

    const saved = await this.repo.save(assignment);
    return { success: true, data: saved };
  }

  async remove(id: number) {
    const assignment = await this.findById(id);
    await this.repo.remove(assignment);
    return { success: true };
  }
}
