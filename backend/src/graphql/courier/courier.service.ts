import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourierService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.courier.findMany({
      include: {
        user: true,
        vehicle: true,
      },
    });
  }

  async findOne(courier_id: number) {
    return this.prisma.courier.findUnique({
      where: { courier_id },
      include: {
        user: true,
        vehicle: true,
      },
    });
  }
}
