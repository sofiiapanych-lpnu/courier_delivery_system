import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { VehicleService } from "src/modules/vehicle/vehicle.service";
import { Courier, Prisma } from "@prisma/client";
import { CreateCourierDto, UpdateCourierDto } from "./dto";

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

  async getAllCouriers(): Promise<Courier[]> {
    return this.prisma.courier.findMany();
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
    const courier = await this.prisma.courier.findUnique({
      where: { courier_id: courierId },
    });

    if (!courier) {
      throw new Error(`Courier with ID ${courierId} not found`);
    }

    let updatedVehicle;
    if (dto.vehicle) {
      updatedVehicle = await this.vehicleService.updateVehicle(courier.license_plate, dto.vehicle);
    }

    return this.prisma.courier.update({
      where: { courier_id: courierId },
      data: {
        license_plate: updatedVehicle.license_plate,
      },
    });
  }

  async deleteCourier(courierId: number): Promise<{ message: string }> {
    const courier = await this.prisma.courier.findUnique({
      where: { courier_id: courierId },
    });

    if (!courier) {
      throw new Error(`Courier with ID ${courierId} not found`);
    }

    await this.prisma.courier.delete({
      where: { courier_id: courierId },
    });

    return { message: `Courier with ID ${courierId} deleted successfully` };
  }
}
