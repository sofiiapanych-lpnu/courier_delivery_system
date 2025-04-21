import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Warehouse } from '@prisma/client';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) { }

  async createWarehouse(dto: CreateWarehouseDto): Promise<Warehouse> {
    return await this.prisma.warehouse.create({
      data: {
        address_id: dto.addressId,
        name: dto.name,
        contact_number: dto.contactNumber,
      },
    });
  }

  async getAllWarehouse(query: {
    name?: string;
    contactNumber?: string;
    address?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: Warehouse[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { name, contactNumber, address, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.WarehouseWhereInput = {
      AND: [
        name ? { name: { contains: name, mode: 'insensitive' } } : {},
        contactNumber ? { contact_number: { contains: contactNumber, mode: 'insensitive' } } : {},
        address ? {
          address: {
            OR: [
              !isNaN(Number(address)) ? { building_number: Number(address) } : {},
              !isNaN(Number(address)) ? { apartment_number: Number(address) } : {},
              { street_name: { contains: address, mode: 'insensitive' } },
              { city: { contains: address, mode: 'insensitive' } },
              { country: { contains: address, mode: 'insensitive' } }
            ]
          }
        } : {},
      ],
    };

    const [warehouses, total] = await Promise.all([
      this.prisma.warehouse.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          address: true,
        },
      }),
      this.prisma.warehouse.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: warehouses,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      },
    };
  }

  async getWarehouseById(id: number): Promise<Warehouse> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { warehouse_id: id },
      include: {
        address: true,
      },
    });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async updateWarehouse(id: number, dto: UpdateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { warehouse_id: id },
      include: {
        address: true,
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return this.prisma.warehouse.update({
      where: { warehouse_id: id },
      data: {
        address_id: dto.addressId,
        name: dto.name,
        contact_number: dto.contactNumber,
      },
    });
  }

  async deleteWarehouse(id: number): Promise<{ message: string }> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { warehouse_id: id },
    });

    if (!warehouse) {
      throw new Error(`Warehouse with ID ${id} not found`);
    }

    await this.prisma.warehouse.delete({
      where: { warehouse_id: id },
    });

    return { message: `Warehouse with ID ${id} deleted successfully` };
  }
}
