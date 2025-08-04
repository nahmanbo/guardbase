import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/role.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  // create new assignment (commander only)
  @Post()
  @Roles('commander')
  create(@Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.create(dto);
  }

  // get all assignments (commander only)
  @Get()
  @Roles('commander')
  findAll() {
    return this.assignmentsService.findAll();
  }

  // get current soldier's assignments
  @Get('my-assignments')
  @Roles('soldier')
  getMyAssignments(
    @Req() req: Request & { user: { id: number; role: string } },
  ) {
    return this.assignmentsService.findByUserId(req.user.id);
  }

  // delete assignment by id (commander only)
  @Delete(':id')
  @Roles('commander')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(+id);
  }
}
