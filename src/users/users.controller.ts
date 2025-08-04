import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Signup - public
  @Post('signup')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.signup(dto);
  }

  // ✅ Get all users - admin only
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  // ✅ Get user by ID - commander/admin
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('commander', 'admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  // ✅ Update user - commander/admin
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('commander', 'admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // ✅ Delete user - admin only
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}