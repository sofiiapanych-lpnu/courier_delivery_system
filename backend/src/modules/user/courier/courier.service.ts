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

    if (existingVehicle) {
      if (existingVehicle.is_company_owner) {
        return existingVehicle.license_plate;
      }

      if (courier.license_plate !== existingVehicle.license_plate) {
        throw new Error('This vehicle already exists and is not owned by a company.');
      }

      return existingVehicle.license_plate;
    }

    this.validateVehicleFields(vehicleDto);

    const newVehicle = await this.vehicleService.createVehicle(vehicleDto as CreateVehicleDto);
    return newVehicle.license_plate;
  }

  private validateVehicleFields(vehicle: UpdateVehicleDto): void {
    const { model, transportType, isCompanyOwner, licensePlate } = vehicle;

    if (!model || !transportType || isCompanyOwner == null || !licensePlate) {
      throw new Error('Missing required vehicle fields: model, transportType, isCompanyOwner or licensePlate');
    }
  }
}
