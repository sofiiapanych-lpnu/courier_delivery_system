import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    return await this.prisma.order.create({
      data: {
        order_type: dto.orderType,
        description: dto.description,
        cost: dto.cost,
        payment_method: dto.paymentMethod,
        weight: dto.weight,
        length: dto.length,
        width: dto.width,
        height: dto.height,
      }
    });
  }

  async getAllOrder(query: {
    orderType?: string;
    description?: string;
    cost?: number;
    paymentMethod?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    page?: number;
    limit?: number;
  }): Promise<Order[]> {
    const { orderType, description, cost, paymentMethod, weight, length, width, height, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    return await this.prisma.order.findMany({
      where: {
        AND: [
          orderType ? { order_type: { contains: orderType, mode: 'insensitive' } } : {},
          description ? { description: { contains: description, mode: 'insensitive' } } : {},
          cost !== undefined ? { cost: cost } : {},
          paymentMethod ? { paymentMethod: { contains: paymentMethod, mode: 'insensitive' } } : {},
          weight !== undefined ? { weight: weight } : {},
          length !== undefined ? { length: length } : {},
          width !== undefined ? { width: width } : {},
          height !== undefined ? { height: height } : {},
        ]
      },
      skip,
      take: limit,
    });
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { order_id: id } });

    if (!order) {
      throw new Error(`Courier with ID ${id} not found`);
    }

    return order;
  }

  async updateOrder(id: number, dto: UpdateOrderDto) {
    const existing = await this.getOrderById(id);
    if (!existing) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { order_id: id },
      data: dto,
    });
  }

  async deleteOrder(id: number) {
    const existing = await this.getOrderById(id);
    if (!existing) throw new NotFoundException('Order not found');

    return this.prisma.order.delete({ where: { order_id: id } });
  }
}
