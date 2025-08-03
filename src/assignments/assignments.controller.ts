import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  UseGuards, ParseIntPipe, Req
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Roles } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('assignments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  // Create new assignment (commander or admin only)
  @Post()
  @Roles('commander', 'admin')
  create(@Body() dto: CreateAssignmentDto) {
    return this.service.create(dto);
  }

  // Get all assignments (commander or admin only)
  @Get()
  @Roles('commander', 'admin')
  findAll() {
    return this.service.findAll();
  }

  // Get my assignments (soldier only)
  @Get('my')
  @Roles('soldier')
  findMine(@Req() req) {
    return this.service.findByUserId(req.user.userId);
  }

  // Get specific assignment by ID (commander or admin only)
  @Get(':id')
  @Roles('commander', 'admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  // Update assignment (commander or admin only)
  @Patch(':id')
  @Roles('commander', 'admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssignmentDto) {
    return this.service.update(id, dto);
  }

  // Delete assignment (admin only)
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
