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

  async getAllDelivery(query: {
    orderId?: number;
    courierId?: number;
    clientId?: number;
    addressId?: number;
    deliveryType?: string;
    deliveryCost?: number;
    paymentMethod?: string;
    deliveryStatus?: string;
    startTime?: Date;
    endTime?: Date;
    desiredDuration?: number;
    warehouseId?: number;
    page?: number;
    limit?: number;
  }) {
    const { orderId, courierId, clientId, addressId, deliveryType,
      deliveryCost, paymentMethod, deliveryStatus, startTime, endTime,
      desiredDuration, warehouseId, page = 1, limit = 10, } = query;
    const skip = (page - 1) * limit;

    return this.prisma.delivery.findMany({
      where: {
        AND: [
          orderId !== undefined ? { order_id: orderId } : {},
          courierId !== undefined ? { courier_id: courierId } : {},
          clientId !== undefined ? { client_id: clientId } : {},
          addressId !== undefined ? { address_id: addressId } : {},
          deliveryType ? { delivery_type: { contains: deliveryType, mode: 'insensitive' } } : {},
          deliveryCost !== undefined ? { delivery_cost: deliveryCost } : {},
          paymentMethod ? { payment_method: { contains: paymentMethod, mode: 'insensitive' } } : {},
          deliveryStatus ? { delivery_status: { contains: deliveryStatus, mode: 'insensitive' } } : {},
          desiredDuration !== undefined ? { desired_duration: desiredDuration } : {},
          warehouseId !== undefined ? { warehouse_id: warehouseId } : {},
          startTime ? { start_time: { gte: startTime } } : {},
          endTime ? { end_time: { lte: endTime } } : {},
        ]
      },
      skip,
      take: limit,
      orderBy: {
        start_time: 'desc',
      },
    });
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

  async getDeliveryByCourierId(id: number) {
    const deliveries = await this.prisma.delivery.findMany({
      where: { courier_id: id },
    });

    if (!deliveries || deliveries.length === 0) {
      throw new NotFoundException(`No deliveries found for courier with ID ${id}`);
    }

    return deliveries;
  }
}
