import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Registers a new user
  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.usersService.signup(body);
  }
}
