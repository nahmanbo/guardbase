import {
  Controller, Get, Post, Body, Param, Delete, UseGuards, Req
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { Role } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Request } from 'express';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  // Creates a new assignment (commander only)
  @Post()
  @UseGuards(RolesGuard)
  @Role('commander')
  create(@Body() dto: { userId: number, shiftId: number }) {
    return this.assignmentsService.create(dto);
  }

  // Gets all assignments (commander only)
  @Get()
  @UseGuards(RolesGuard)
  @Role('commander')
  findAll() {
    return this.assignmentsService.findAll();
  }

  // Gets assignments for current user
  @Get('me')
  getMyAssignments(@Req() req: Request) {
    return this.assignmentsService.findByUserId(req.user.id);
  }

  // Deletes assignment (commander only)
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Role('commander')
  remove(@Param('id') id: number) {
    return this.assignmentsService.remove(id);
  }
}
