import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(email: string, password: string) {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    // Create default board for new user
    await this.prisma.board.create({
      data: { name: 'My Board', userId: user.id },
    });

    return this.generateToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    return this.generateToken(user.id, user.email);
  }

  private generateToken(id: string, email: string) {
    const payload = { sub: id, email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
