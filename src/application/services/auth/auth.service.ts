import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { LoginResponseDto } from 'src/presentation/dtos/auth/login-response.dto';

interface AuthResponse extends LoginResponseDto {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          fullname: `${user.firstName} ${user.lastName}`,
          role: user.role,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    try {
      return await hash(password, saltRounds);
    } catch {
      throw new Error('Password hashing failed');
    }
  }
}
