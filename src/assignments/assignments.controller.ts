import { Controller, Post, Body } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  create(@Body() body: Partial<Assignment>) {
    return this.assignmentsService.create(body);
  }
}

