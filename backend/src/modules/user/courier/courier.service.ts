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
    const existingVehicle = await tx.vehicle.findUnique({
      where: { license_plate: dto.vehicle.licensePlate },
    });

    let licensePlateToUse: string;

    if (existingVehicle) {
      licensePlateToUse = existingVehicle.license_plate;
    } else {
      const createdVehicle = await this.vehicleService.createVehicle(dto.vehicle, tx);
      licensePlateToUse = createdVehicle.license_plate;
    }

    return tx.courier.create({
      data: {
        user_id: dto.userId,
        license_plate: licensePlateToUse,
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
      if (
        !vehicleDto.licensePlate ||
        !vehicleDto.model ||
        !vehicleDto.transportType ||
        vehicleDto.isCompanyOwner === undefined
      ) {
        throw new Error('Cannot create vehicle: missing required fields');
      }

      const oldVehicle = await this.prisma.vehicle.findUnique({
        where: { license_plate: courier.license_plate },
      });

      const result = await this.prisma.$transaction(async (prisma) => {
        const createdVehicle = await prisma.vehicle.create({
          data: {
            license_plate: vehicleDto.licensePlate!,
            model: vehicleDto.model!,
            transport_type: vehicleDto.transportType!,
            is_company_owner: vehicleDto.isCompanyOwner!,
          },
        });

        await prisma.courier.update({
          where: { courier_id: courier.courier_id },
          data: { license_plate: createdVehicle.license_plate },
        });

        if (oldVehicle && !oldVehicle.is_company_owner) {
          await prisma.vehicle.delete({
            where: { license_plate: oldVehicle.license_plate },
          });
        }

        return createdVehicle.license_plate;
      });

      return result;
    }

    if (
      (existingVehicle.is_company_owner || courier.license_plate === existingVehicle.license_plate) &&
      licensePlate
    ) {
      await this.vehicleService.updateVehicle(licensePlate, vehicleDto);
      return licensePlate;
    }

    throw new Error('This vehicle already exists and is not owned by a company.');
  }

  async getCourierStatistics(query: {
    startDate?: Date;
    endDate?: Date;
    courierId?: number;
    groupBy?: 'year' | 'month' | 'day';
    page?: number;
    limit?: number;
  }) {
    const { startDate, endDate, courierId, groupBy, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.DeliveryWhereInput = {
      ...(startDate ? { start_time: { gte: startDate } } : {}),
      ...(endDate ? { end_time: { lte: endDate } } : {}),
      ...(courierId ? { courier_id: courierId } : {}),
    };

    const deliveries = await this.prisma.delivery.findMany({
      where: whereClause,
      include: {
        courier: { include: { user: true } },
        Client: { include: { user: true } },
        warehouse: { include: { address: true } },
        Address: true,
        order: true,
      },
    });

    const grouped = deliveries.reduce((acc, delivery) => {
      if (!delivery.courier || !delivery.start_time) return acc;

      const date = new Date(delivery.start_time);
      let groupKey = 'all';

      if (groupBy === 'year') {
        groupKey = `${date.getFullYear()}`;
      } else if (groupBy === 'month') {
        groupKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else if (groupBy === 'day') {
        groupKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      }

      const courierId = delivery.courier.courier_id;
      const courierName = `${delivery.courier.user?.first_name ?? ''} ${delivery.courier.user?.last_name ?? ''}`.trim();

      if (!acc[groupKey]) {
        acc[groupKey] = {};
      }

      if (!acc[groupKey][courierId]) {
        acc[groupKey][courierId] = {
          courierId,
          courierName,
          totalDeliveries: 0,
          totalCost: 0,
          avgDeliveryCost: 0,
          inProgressDeliveries: 0,
          completedDeliveries: 0,
          averageDeliveryTimeMinutes: 0,
          totalDeliveryTimeMinutes: 0,
          deliveries: [],
        };
      }

      const group = acc[groupKey][courierId];

      group.totalDeliveries += 1;
      group.totalCost += delivery.delivery_cost ? delivery.delivery_cost.toNumber() : 0;

      if (delivery.delivery_status?.toLowerCase() === 'completed') {
        group.completedDeliveries += 1;
      }
      if (delivery.delivery_status?.toLowerCase() === 'in_progress') {
        group.inProgressDeliveries += 1;
      }

      if (delivery.start_time && delivery.end_time) {
        const deliveryTimeMinutes = (new Date(delivery.end_time).getTime() - new Date(delivery.start_time).getTime()) / (1000 * 60);
        group.totalDeliveryTimeMinutes += deliveryTimeMinutes;
      }

      group.deliveries.push(delivery);

      return acc;
    }, {} as Record<string, Record<number, any>>);

    const resultArray = Object.entries(grouped).map(([groupKey, couriers]) => ({
      group: groupKey,
      couriers: Object.values(couriers).map(courierStats => ({
        ...courierStats,
        avgDeliveryCost: courierStats.totalDeliveries > 0
          ? +(courierStats.totalCost / courierStats.totalDeliveries).toFixed(2)
          : 0,
        averageDeliveryTimeMinutes: courierStats.totalDeliveries > 0
          ? +(courierStats.totalDeliveryTimeMinutes / courierStats.totalDeliveries).toFixed(2)
          : 0,
      }))
    }));

    const totalItems = resultArray.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedItems = resultArray.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
      },
    };
  }


}

