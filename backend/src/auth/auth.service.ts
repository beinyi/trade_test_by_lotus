import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from 'src/admin/admin.schema';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private adminsService: AdminService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(
    username: string,
    password: string,
  ): Promise<Omit<Admin, 'password'>> {
    const admin = await this.adminsService.findByUsername(username);
    if (
      admin &&
      (await this.adminsService.validatePassword(password, admin.password))
    ) {
      delete admin.password;
      return admin;
    }
    throw new UnauthorizedException('Ошибка авторизации');
  }

  async login(admin: Omit<Admin, 'password'>) {
    const payload = { username: admin.username, sub: admin._id, role: 'admin' };
    return {
      jwttoken: this.jwtService.sign(payload),
    };
  }
}
