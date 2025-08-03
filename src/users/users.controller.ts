import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Registers a new user
  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.usersService.signup(body);
  }

  // Logs in a user
  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.usersService.login(body);
  }

  // Returns all users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Returns user by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // Updates user by ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateUserDto>) {
    return this.usersService.update(+id, body);
  }

  // Deletes user by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
