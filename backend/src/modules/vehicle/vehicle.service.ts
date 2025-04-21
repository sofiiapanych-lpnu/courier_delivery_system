import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Vehicle } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) { }

  async createVehicle(dto: CreateVehicleDto, tx?: Prisma.TransactionClient): Promise<Vehicle> {
    const prisma = tx ?? this.prisma;
    return prisma.vehicle.create({
      data: {
        license_plate: dto.licensePlate,
        model: dto.model,
        transport_type: dto.transportType,
        is_company_owner: dto.isCompanyOwner,
      },
    });
  }

  async getAllVehicles(query: {
    licensePlate?: string;
    model?: string;
    transportType?: string;
    isCompanyOwner?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    items: Vehicle[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const {
      licensePlate,
      model,
      transportType,
      isCompanyOwner,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const whereClause: Prisma.VehicleWhereInput = {
      AND: [
        licensePlate ? { license_plate: { contains: licensePlate, mode: 'insensitive' } } : {},
        model ? { model: { contains: model, mode: 'insensitive' } } : {},
        transportType ? { transport_type: { contains: transportType, mode: 'insensitive' } } : {},
        isCompanyOwner !== undefined ? { is_company_owner: isCompanyOwner } : {},
      ]
    };

    const [vehicles, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          Courier: {
            include: {
              user: true,
            }
          }
        }
      }),
      this.prisma.vehicle.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: vehicles,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      },
    };
  }


  async getVehicleById(licensePlate: string): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { license_plate: licensePlate },
      include: {
        Courier: {
          include: {
            user: true,
          }
        }
      }
    });

    if (!vehicle) {
      throw new Error(`Vehicle with ID ${licensePlate} not found`);
    }

    return vehicle;
  }

  async updateVehicle(licensePlate: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { license_plate: licensePlate },
    });

    if (!vehicle) {
      throw new Error(`Vehicle with ID ${licensePlate} not found`);
    }

    return this.prisma.vehicle.update({
      where: { license_plate: licensePlate },
      data: {
        license_plate: dto.licensePlate,
        model: dto.model,
        transport_type: dto.transportType,
        is_company_owner: dto.isCompanyOwner,
      },
    });
  }

  async deleteVehicle(licensePlate: string): Promise<{ message: string }> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { license_plate: licensePlate },
    });

    if (!vehicle) {
      throw new Error(`Vehicle with ID ${licensePlate} not found`);
    }

    await this.prisma.vehicle.delete({
      where: { license_plate: licensePlate },
    });

    return { message: `Vehicle with ID ${licensePlate} deleted successfully` };
  }

  async getCompanyVehicles(): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: {
        is_company_owner: true,
      },
      orderBy: {
        transport_type: 'asc',
      },
    });
  }

}
