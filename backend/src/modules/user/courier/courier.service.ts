import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { VehicleService } from "src/modules/vehicle/vehicle.service";
import { Courier, Prisma } from "@prisma/client";
import { CreateCourierDto, UpdateCourierDto } from "./dto";
import { console } from "inspector";
import { CreateVehicleDto, UpdateVehicleDto } from "src/modules/vehicle/dto";

@Injectable()
export class CourierService {
  constructor(
    private prisma: PrismaService,
    private vehicleService: VehicleService
  ) { }

  async createCourier(
    dto: CreateCourierDto,
    tx: Prisma.TransactionClient
  ): Promise<Courier> {
    const createdVehicle = await this.vehicleService.createVehicle(dto.vehicle, tx);

    return tx.courier.create({
      data: {
        user_id: dto.userId,
        license_plate: createdVehicle.license_plate,
      },
    });
  }

  async getAllCouriers(query: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    page?: number;
    limit?: number;
  }): Promise<Courier[]> {
    const { firstName, lastName, phoneNumber, email, page = 1, limit = 10, } = query;
    const skip = (page - 1) * limit;

    return this.prisma.courier.findMany({
      where: {
        user: {
          AND: [
            firstName ? { first_name: { contains: firstName, mode: 'insensitive' } } : {},
            lastName ? { last_name: { contains: lastName, mode: 'insensitive' } } : {},
            phoneNumber ? { phone_number: { contains: phoneNumber, mode: 'insensitive' } } : {},
            email ? { email: { contains: email, mode: 'insensitive' } } : {},
          ]
        }
      },
      skip,
      take: limit,
      include: {
        user: true,
      },
    });
  }

  async getCourierById(courierId: number): Promise<Courier> {
    const courier = await this.prisma.courier.findUnique({
      where: { courier_id: courierId },
    });

    if (!courier) {
      throw new Error(`Courier with ID ${courierId} not found`);
    }

    return courier;
  }

  async updateCourier(courierId: number, dto: UpdateCourierDto): Promise<Courier> {
    console.log('DTO received:', dto);

    const courier = await this.findCourierOrThrow(courierId);

    let licensePlateToAssign = courier.license_plate;
    const vehicleDto = dto.vehicle;

    if (vehicleDto?.licensePlate) {
      licensePlateToAssign = await this.handleVehicleAssignment(vehicleDto, courier);
    }

    return this.prisma.courier.update({
      where: { courier_id: courierId },
      data: { license_plate: licensePlateToAssign },
      include: {
        user: true,
        vehicle: true,
      },
    });
  }


  async deleteCourier(courierId: number): Promise<{ message: string }> {
    const courier = await this.prisma.courier.findUnique({
      where: { courier_id: courierId },
      include: { vehicle: true },
    });

    if (!courier) {
      throw new Error(`Courier with ID ${courierId} not found`);
    }

    if (courier?.vehicle && !courier.vehicle.is_company_owner) {
      await this.prisma.vehicle.delete({ where: { license_plate: courier.license_plate } });
    }

    await this.prisma.courier.delete({
      where: { courier_id: courierId },
    });

    await this.prisma.user.delete({
      where: { user_id: courier.user_id },
    });

    return { message: `Courier with ID ${courierId} deleted successfully` };
  }


  private async findCourierOrThrow(courierId: number): Promise<Courier> {
    const courier = await this.prisma.courier.findUnique({
      where: { courier_id: courierId },
    });

    if (!courier) {
      throw new Error(`Courier with ID ${courierId} not found`);
    }

    return courier;
  }

  private async handleVehicleAssignment(vehicleDto: UpdateVehicleDto, courier: Courier): Promise<string> {
    const { licensePlate } = vehicleDto;
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { license_plate: licensePlate },
    });

    if (!existingVehicle) {
      throw new Error('Vehicle does not exist. Cannot assign or update.');
    }

    if ((existingVehicle.is_company_owner || courier.license_plate === existingVehicle.license_plate) && licensePlate) {
      await this.vehicleService.updateVehicle(licensePlate, vehicleDto);
      return licensePlate;
    }

    throw new Error('This vehicle already exists and is not owned by a company.');
  }

}

