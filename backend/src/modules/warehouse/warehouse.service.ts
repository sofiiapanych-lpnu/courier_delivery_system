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
    page?: number;
    limit?: number;
  }): Promise<Warehouse[]> {
    const { name, contactNumber, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    return this.prisma.warehouse.findMany({
      where: {
        AND: [
          name ? { name: { contains: name, mode: 'insensitive' } } : {},
          contactNumber ? { contact_number: { contains: contactNumber, mode: 'insensitive' } } : {},
        ],
      },
      skip,
      take: limit,
    });
  }


  async getWarehouseById(id: number): Promise<Warehouse> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { warehouse_id: id },
    });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async updateWarehouse(id: number, dto: UpdateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { warehouse_id: id },
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
