import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';

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
    minCost?: number;
    maxCost?: number;
    minWeight?: number;
    maxWeight?: number;
    minLength?: number;
    maxLength?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    paymentMethod?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: Order[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const {
      orderType,
      description,
      minCost,
      maxCost,
      minWeight,
      maxWeight,
      minLength,
      maxLength,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      paymentMethod,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const whereClause: Prisma.OrderWhereInput = {
      AND: [
        orderType ? { order_type: { contains: orderType, mode: 'insensitive' } } : {},
        description ? { description: { contains: description, mode: 'insensitive' } } : {},
        paymentMethod ? { payment_method: { contains: paymentMethod, mode: 'insensitive' } } : {},

        (minCost !== undefined || maxCost !== undefined)
          ? {
            cost: {
              ...(minCost !== undefined ? { gte: minCost } : {}),
              ...(maxCost !== undefined ? { lte: maxCost } : {}),
            }
          }
          : {},

        (minWeight !== undefined || maxWeight !== undefined)
          ? {
            weight: {
              ...(minWeight !== undefined ? { gte: minWeight } : {}),
              ...(maxWeight !== undefined ? { lte: maxWeight } : {}),
            }
          }
          : {},

        (minLength !== undefined || maxLength !== undefined)
          ? {
            length: {
              ...(minLength !== undefined ? { gte: minLength } : {}),
              ...(maxLength !== undefined ? { lte: maxLength } : {}),
            }
          }
          : {},

        (minWidth !== undefined || maxWidth !== undefined)
          ? {
            width: {
              ...(minWidth !== undefined ? { gte: minWidth } : {}),
              ...(maxWidth !== undefined ? { lte: maxWidth } : {}),
            }
          }
          : {},

        (minHeight !== undefined || maxHeight !== undefined)
          ? {
            height: {
              ...(minHeight !== undefined ? { gte: minHeight } : {}),
              ...(maxHeight !== undefined ? { lte: maxHeight } : {}),
            }
          }
          : {},
      ]
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.order.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: orders,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      },
    };
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
      data: {
        order_type: dto.orderType,
        description: dto.description,
        cost: dto.cost,
        payment_method: dto.paymentMethod,
        weight: dto.weight,
        length: dto.length,
        width: dto.width,
        height: dto.height,
      },
    });
  }

  async deleteOrder(id: number) {
    const existing = await this.getOrderById(id);
    if (!existing) throw new NotFoundException('Order not found');

    return this.prisma.order.delete({ where: { order_id: id } });
  }
}
