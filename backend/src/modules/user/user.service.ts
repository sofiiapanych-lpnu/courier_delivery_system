import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { User } from "@prisma/client";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ClientService } from "./client/client.service";
import { CourierService } from "./courier/courier.service";
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private clientService: ClientService,
    private courierService: CourierService
  ) { }

  async createUser(dto: CreateUserDto): Promise<User> {
    if (dto.role === "client" && dto.vehicle) {
      throw new BadRequestException("Clients cannot have a vehicle.");
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: dto.email,
          hash: dto.password,
          phone_number: dto.phoneNumber,
          first_name: dto.firstName,
          last_name: dto.lastName,
          role: dto.role,
        },
      });

      if (dto.role === "client") {
        await this.clientService.createClient({
          userId: createdUser.user_id,
          addressId: null,
        }, tx);
      } else if (dto.role === "courier") {
        if (!dto.vehicle) {
          throw new BadRequestException("Vehicle data is required for couriers");
        }

        await this.courierService.createCourier(
          {
            userId: createdUser.user_id,
            vehicle: dto.vehicle,
          },
          tx
        );
      }

      return createdUser;
    });

    return user;
  }

  async getAllUsers(query: {
    email?: string;
    phoneNumber?: string;
    firstName?: string
    lastName?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<User[]> {
    const { email, phoneNumber, firstName, lastName, role, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    return this.prisma.user.findMany({
      where: {
        AND: [
          email ? { email: { contains: email, mode: 'insensitive' } } : {},
          phoneNumber ? { phone_number: { contains: phoneNumber, mode: 'insensitive' } } : {},
          firstName ? { first_name: { contains: firstName, mode: 'insensitive' } } : {},
          lastName ? { last_name: { contains: lastName, mode: 'insensitive' } } : {},
          role ? { role: { contains: role, mode: 'insensitive' } } : {},
        ]
      },
      skip,
      take: limit,
    });
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        Courier: {
          include: {
            vehicle: true,
          },
        },
        Client: {
          include: {
            address: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async updateUser(userId: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    let hashedPassword: string | undefined = undefined;

    if (dto.password) {
      hashedPassword = await argon.hash(dto.password);
    }

    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        email: dto.email,
        phone_number: dto.phoneNumber,
        first_name: dto.firstName,
        last_name: dto.lastName,
        ...(hashedPassword && { hash: hashedPassword }),
      },
    });
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.prisma.user.delete({
      where: { user_id: userId },
    });

    return { message: `User with ID ${userId} deleted successfully` };
  }
}
