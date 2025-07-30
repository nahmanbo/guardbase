import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly repo: Repository<Assignment>,
  ) {}

  // Creates a new assignment and returns success or error response
  async create(assignmentData: Partial<Assignment>): 
  Promise<{ success: true; data: Assignment } | { success: false; error: string }> {
    try {
      const assignment = this.repo.create(assignmentData);
      const saved = await this.repo.save(assignment);
      return { success: true, data: saved };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to create assignment' };
    }
  }
}
