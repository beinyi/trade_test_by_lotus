import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('check')
  async getAuth(@Request() req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return { isAuthenticated: false };
    }

    const token = authHeader.split(' ')[1];

    try {
      this.jwtService.verify(token);
      return {
        isAuthenticated: true,
        token,
      };
    } catch (e) {
      return { isAuthenticated: false };
    }
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const admin = await this.authService.validateAdmin(
      body.username,
      body.password,
    );
    return this.authService.login(admin);
  }
}
