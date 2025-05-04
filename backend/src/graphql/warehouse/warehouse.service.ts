import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWarehouseInput } from './dto/create-warehouse.input';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.warehouse.findMany({
      include: {
        address: true,
        deliveries: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.warehouse.findUnique({
      where: { warehouse_id: id },
      include: {
        address: true,
        deliveries: true,
      },
    });
  }

  create(createWarehouseInput: any) {
    const { name, contact_number, address_id } = createWarehouseInput;

    return this.prisma.warehouse.create({
      data: {
        name,
        contact_number: contact_number,
        address_id: address_id,
      },
    });
  }


}
