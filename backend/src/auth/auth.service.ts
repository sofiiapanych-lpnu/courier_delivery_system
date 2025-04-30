import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SignupDto, SigninDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { access } from "fs";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) { }

  async signup(dto: SignupDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.userService.createUser({
        email: dto.email,
        password: hash,
        phoneNumber: dto.phoneNumber,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        vehicle: dto.vehicle,
      });

      return this.signToken(user.user_id, user.email, user.role, user.first_name, user.last_name,);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {//unique field violation
          throw new ForbiddenException('Credentials taken',);
        }
      }
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect'
      )
    }
    const pwMatches = await argon.verify(
      user.hash,
      dto.password
    );
    if (!pwMatches) {
      throw new ForbiddenException(
        'Credentials incorrect'
      )
    }

    return this.signToken(user.user_id, user.email, user.role, user.first_name, user.last_name);
  }

  async signToken(userId: number, email: string, role: string, firstName: string, lastName: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      role,
      username: `${firstName} ${lastName}`,
    }

    const secret = this.config.get('JWT_SECRET')

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    })

    return {
      access_token: token,
    }
  }
}