import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.order.findMany();
  }

  async findOne(order_id: number) {
    return this.prisma.order.findUnique({
      where: { order_id },
    });
  }
}
