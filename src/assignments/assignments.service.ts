import { Injectable } from '@nestjs/common';
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
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Shift)
    private readonly shiftRepo: Repository<Shift>,
  ) {}

  // Creates a new assignment (commander only)
  async create(dto: CreateAssignmentDto, user: User) {
    if (user.role !== 'commander')
      return { success: false, error: 'Only commanders can create assignments' };

    const assignedUser = await this.userRepo.findOneBy({ id: dto.userId });
    const shift = await this.shiftRepo.findOneBy({ id: dto.shiftId });

    if (!assignedUser || !shift)
      return { success: false, error: 'User or shift not found' };

    const assignment = this.repo.create({ user: assignedUser, shift });
    const saved = await this.repo.save(assignment);
    return { success: true, data: saved };
  }

  // Returns all assignments (commander sees all, soldier only own)
  async findAll(user: User) {
    if (user.role === 'commander') {
      const all = await this.repo.find({ relations: ['user', 'shift'] });
      return { success: true, data: all };
    }
    const mine = await this.repo.find({ where: { user: { id: user.id } }, relations: ['user', 'shift'] });
    return { success: true, data: mine };
  }

  // Returns one assignment by ID (only if allowed)
  async findOne(id: number, user: User) {
    const assignment = await this.repo.findOne({ where: { id }, relations: ['user', 'shift'] });
    if (!assignment)
      return { success: false, error: 'Assignment not found' };

    if (user.role === 'soldier' && assignment.user.id !== user.id)
      return { success: false, error: 'Access denied' };

    return { success: true, data: assignment };
  }

  // Updates an assignment (commander only)
  async update(id: number, dto: UpdateAssignmentDto, user: User) {
    if (user.role !== 'commander')
      return { success: false, error: 'Only commanders can update assignments' };

    const assignment = await this.repo.findOne({ where: { id }, relations: ['user', 'shift'] });
    if (!assignment)
      return { success: false, error: 'Assignment not found' };

    if (dto.userId) {
      const newUser = await this.userRepo.findOneBy({ id: dto.userId });
      if (!newUser) return { success: false, error: 'User not found' };
      assignment.user = newUser;
    }

    if (dto.shiftId) {
      const newShift = await this.shiftRepo.findOneBy({ id: dto.shiftId });
      if (!newShift) return { success: false, error: 'Shift not found' };
      assignment.shift = newShift;
    }

    const saved = await this.repo.save(assignment);
    return { success: true, data: saved };
  }

  // Deletes an assignment (commander only)
  async remove(id: number, user: User) {
    if (user.role !== 'commander')
      return { success: false, error: 'Only commanders can delete assignments' };

    const assignment = await this.repo.findOneBy({ id });
    if (!assignment)
      return { success: false, error: 'Assignment not found' };

    await this.repo.remove(assignment);
    return { success: true };
  }
}
