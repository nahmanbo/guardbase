import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Creates a new user (signup)
  @Post('signup')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.signup(dto);
  }

  // Gets all users (admin only)
  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  // Gets a user by id (admin or commander)
  @Get(':id')
  @Roles('commander', 'admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  // Updates a user (admin or commander only)
  @Patch(':id')
  @Roles('commander', 'admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // Deletes a user (admin only)
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
