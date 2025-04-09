import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) { }

  async createDelivery(dto: CreateDeliveryDto) {
    return await this.prisma.delivery.create({
      data: {
        order_id: dto.orderId,
        courier_id: dto.courierId,
        client_id: dto.clientId,
        address_id: dto.addressId,
        delivery_type: dto.deliveryType,
        delivery_cost: dto.deliveryCost,
        payment_method: dto.paymentMethod,
        delivery_status: dto.deliveryStatus,
        start_time: dto.startTime,
        end_time: dto.endTime,
        desired_duration: dto.desiredDuration,
        warehouse_id: dto.warehouseId,
      },
    });
  }

  async getAllDelivery() {
    return this.prisma.delivery.findMany();
  }

  async getDeliveryById(id: number) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { delivery_id: id },
    });
    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }
    return delivery;
  }

  async updateDelivery(id: number, dto: UpdateDeliveryDto) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { delivery_id: id },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    return this.prisma.delivery.update({
      where: { delivery_id: id },
      data: {
        order_id: dto.orderId,
        courier_id: dto.courierId,
        client_id: dto.clientId,
        address_id: dto.addressId,
        delivery_type: dto.deliveryType,
        delivery_cost: dto.deliveryCost,
        payment_method: dto.paymentMethod,
        delivery_status: dto.deliveryStatus,
        start_time: dto.startTime,
        end_time: dto.endTime,
        desired_duration: dto.desiredDuration,
        warehouse_id: dto.warehouseId,
      },
    });
  }

  async deleteDelivery(id: number) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { delivery_id: id },
    });

    if (!delivery) {
      throw new Error(`Delivery with ID ${id} not found`);
    }

    await this.prisma.delivery.delete({
      where: { delivery_id: id },
    });

    return { message: `Delivery with ID ${id} deleted successfully` };
  }
}
