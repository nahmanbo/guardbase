import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Roles } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  // Creates a new shift (commander only)
  @Post()
  @Roles('commander')
  create(@Body() dto: CreateShiftDto) {
    return this.shiftsService.create(dto);
  }

  // Returns all shifts (commander only)
  @Get()
  @Roles('commander')
  findAll() {
    return this.shiftsService.findAll();
  }

  // Returns one shift by id (commander only)
  @Get(':id')
  @Roles('commander')
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(+id);
  }

  // Updates a shift by id (commander only)
  @Patch(':id')
  @Roles('commander')
  update(@Param('id') id: string, @Body() dto: UpdateShiftDto) {
    return this.shiftsService.update(+id, dto);
  }

  // Deletes a shift by id (commander only)
  @Delete(':id')
  @Roles('commander')
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(+id);
  }
}
 