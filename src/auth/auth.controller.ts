import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Handles login requests and returns token if successful
  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }
}
