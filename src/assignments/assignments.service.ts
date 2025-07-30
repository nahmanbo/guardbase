import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from '../users/user.entity';
import { Shift } from '../shifts/shift.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

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

  // Creates a new assignment and returns success or error response
  async create(dto: CreateAssignmentDto): 
  Promise<{ success: true; data: Assignment } | { success: false; error: string }> {
    try {
      const user = await this.userRepo.findOneBy({ id: dto.userId });
      const shift = await this.shiftRepo.findOneBy({ id: dto.shiftId });

      if (!user || !shift) {
        return { success: false, error: 'User or Shift not found' };
      }

      const assignment = this.repo.create({ user, shift });
      const saved = await this.repo.save(assignment);
      return { success: true, data: saved };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to create assignment' };
    }
  }
}
