import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDeliveryInput } from './dto/create-delivery.input';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.delivery.findMany({
      include: {
        warehouse: {
          include: {
            address: true,
          },
        },
        Address: true,
        order: true,
        Client: {
          include: {
            user: true,
            address: true,
          },
        },
        courier: {
          include: {
            user: true,
            vehicle: true,
          },
        },
      },
    });
  }

  async findOne(delivery_id: number) {
    return this.prisma.delivery.findUnique({
      where: { delivery_id },
      include: {
        warehouse: {
          include: {
            address: true,
          },
        },
        Address: true,
        order: true,
        Client: {
          include: {
            address: true,
          },
        },
        courier: {
          include: {
            vehicle: true,
          },
        },
      },
    });
  }

  async create(data: CreateDeliveryInput) {
    return this.prisma.delivery.create({
      data: {
        ...data,
        delivery_cost: data.delivery_cost,
        desired_duration: data.desired_duration,
      },
    });
  }
}
