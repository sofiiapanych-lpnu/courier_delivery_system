import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) { }

  async createWarehouse(dto: CreateWarehouseDto) {
    return await this.prisma.warehouse.create({
      data: {
        address_id: dto.addressId,
        name: dto.name,
        contact_number: dto.contactNumber,
      },
    });
  }

  async getAllWarehouse() {
    return this.prisma.warehouse.findMany();
  }

  async getWarehouseById(id: number) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { warehouse_id: id },
    });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async updateWarehouse(id: number, dto: UpdateWarehouseDto) {
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

  async deleteWarehouse(id: number) {
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
