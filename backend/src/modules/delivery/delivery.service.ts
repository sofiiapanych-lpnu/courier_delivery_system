import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
    warehouseAddressQuery?: string;
    clientAddressQuery?: string;
    orderTypeQuery?: string;
    clientNameQuery?: string;
    courierNameQuery?: string;
    minCost?: number;
    maxCost?: number;
    paymentMethods?: string[];
    page?: number;
    limit?: number;
  }) {
    const {
      orderId, courierId, clientId, addressId, deliveryType,
      deliveryCost, paymentMethod, deliveryStatus, startTime, endTime,
      desiredDuration, warehouseId, warehouseAddressQuery, clientAddressQuery, orderTypeQuery, clientNameQuery, courierNameQuery, minCost, maxCost, paymentMethods, page = 1, limit = 10
    } = query;

    const skip = (page - 1) * limit;

    const whereClause: Prisma.DeliveryWhereInput = {
      AND: [
        orderId !== undefined ? { order_id: orderId } : {},
        courierId !== undefined ? { courier_id: courierId } : {},
        clientId !== undefined ? { client_id: clientId } : {},
        addressId !== undefined ? { address_id: addressId } : {},
        deliveryType ? {
          delivery_type: {
            contains: deliveryType,
            mode: Prisma.QueryMode.insensitive
          }
        } : {},
        deliveryCost !== undefined ? { delivery_cost: deliveryCost } : {},
        paymentMethod ? {
          payment_method: {
            contains: paymentMethod,
            mode: Prisma.QueryMode.insensitive
          }
        } : {},
        deliveryStatus ? {
          delivery_status: {
            contains: deliveryStatus,
            mode: Prisma.QueryMode.insensitive
          }
        } : {},
        desiredDuration !== undefined ? { desired_duration: desiredDuration } : {},
        warehouseId !== undefined ? { warehouse_id: warehouseId } : {},
        startTime ? { start_time: { gte: startTime } } : {},
        endTime ? { end_time: { lte: endTime } } : {},
        warehouseAddressQuery ? {
          warehouse: {
            OR: [
              { name: { contains: warehouseAddressQuery, mode: 'insensitive' } },
              {
                address: {
                  OR: [
                    !isNaN(Number(warehouseAddressQuery)) ? { building_number: Number(warehouseAddressQuery) } : {},
                    !isNaN(Number(warehouseAddressQuery)) ? { apartment_number: Number(warehouseAddressQuery) } : {},
                    { street_name: { contains: warehouseAddressQuery, mode: 'insensitive' } },
                    { city: { contains: warehouseAddressQuery, mode: 'insensitive' } },
                    { country: { contains: warehouseAddressQuery, mode: 'insensitive' } }
                  ]
                }
              }
            ]
          }
        } : {},

        clientAddressQuery ? {
          Address: {
            OR: [
              !isNaN(Number(clientAddressQuery)) ? { building_number: Number(clientAddressQuery) } : {},
              !isNaN(Number(clientAddressQuery)) ? { apartment_number: Number(clientAddressQuery) } : {},
              { street_name: { contains: clientAddressQuery, mode: 'insensitive' } },
              { city: { contains: clientAddressQuery, mode: 'insensitive' } },
              { country: { contains: clientAddressQuery, mode: 'insensitive' } }
            ]
          }
        } : {},

        orderTypeQuery ? {
          order: {
            order_type: {
              contains: orderTypeQuery,
              mode: 'insensitive'
            }
          }
        } : {},
        clientNameQuery ? {
          Client: {
            user: {
              OR: [
                { first_name: { contains: clientNameQuery, mode: 'insensitive' } },
                { last_name: { contains: clientNameQuery, mode: 'insensitive' } },
              ]
            }
          }
        } : {},
        courierNameQuery ? {
          courier: {
            user: {
              OR: [
                { first_name: { contains: courierNameQuery, mode: 'insensitive' } },
                { last_name: { contains: courierNameQuery, mode: 'insensitive' } },
              ]
            }
          }
        } : {},
        (minCost !== undefined || maxCost !== undefined) ? {
          delivery_cost: {
            ...(minCost !== undefined ? { gte: minCost } : {}),
            ...(maxCost !== undefined ? { lte: maxCost } : {}),
          }
        } : {},
        paymentMethods && paymentMethods.length > 0 ? {
          payment_method: {
            in: paymentMethods
          }
        } : {},
      ]
    };

    const [deliveries, total] = await Promise.all([
      this.prisma.delivery.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          start_time: 'desc',
        },
        include: {
          warehouse: {
            include: {
              address: true,
            }
          },
          Address: true,
          order: true,
          Client: {
            include: {
              user: true,
            }
          },
          courier: {
            include: {
              user: true,
            }
          },
        }
      }),
      this.prisma.delivery.count({
        where: whereClause
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: deliveries,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      }
    };
  }

  async getDeliveryById(id: number) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { delivery_id: id },
      include: {
        warehouse: {
          include: {
            address: true,
          }
        },
        Address: true,
        order: true,
        Client: {
          include: {
            user: true,
          }
        },
        courier: {
          include: {
            user: true,
          }
        },
      }
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
      include: {
        warehouse: {
          include: {
            address: true,
          }
        },
        Address: true,
        order: true,
        Client: {
          include: {
            user: true,
          }
        },
        courier: {
          include: {
            user: true,
          }
        },
      }
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

  async getDeliveryByCourierId(
    id: number,
    query: {
      deliveryType?: string;
      deliveryCost?: number;
      paymentMethod?: string;
      deliveryStatus?: string;
      startTime?: Date;
      endTime?: Date;
      warehouseAddressQuery?: string;
      clientAddressQuery?: string;
      orderTypeQuery?: string;
      clientNameQuery?: string;
      minCost?: number;
      maxCost?: number;
      page?: number;
      limit?: number;
    }
  ) {
    const {
      deliveryType,
      deliveryCost, paymentMethod, deliveryStatus, startTime, endTime, warehouseAddressQuery, clientAddressQuery, orderTypeQuery, clientNameQuery, minCost, maxCost, page = 1, limit = 10
    } = query;

    const skip = (page - 1) * limit;

    const whereClause: Prisma.DeliveryWhereInput = {
      AND: [
        { courier_id: id },
        deliveryType ? {
          delivery_type: {
            contains: deliveryType,
            mode: Prisma.QueryMode.insensitive
          }
        } : {},
        deliveryCost !== undefined ? { delivery_cost: deliveryCost } : {},
        paymentMethod ? {
          payment_method: {
            contains: paymentMethod,
            mode: Prisma.QueryMode.insensitive
          }
        } : {},
        deliveryStatus ? {
          delivery_status: {
            contains: deliveryStatus,
            mode: Prisma.QueryMode.insensitive
          }
        } : {},
        startTime ? { start_time: { gte: startTime } } : {},
        endTime ? { end_time: { lte: endTime } } : {},
        warehouseAddressQuery ? {
          warehouse: {
            OR: [
              { name: { contains: warehouseAddressQuery, mode: 'insensitive' } },
              {
                address: {
                  OR: [
                    !isNaN(Number(warehouseAddressQuery)) ? { building_number: Number(warehouseAddressQuery) } : {},
                    !isNaN(Number(warehouseAddressQuery)) ? { apartment_number: Number(warehouseAddressQuery) } : {},
                    { street_name: { contains: warehouseAddressQuery, mode: 'insensitive' } },
                    { city: { contains: warehouseAddressQuery, mode: 'insensitive' } },
                    { country: { contains: warehouseAddressQuery, mode: 'insensitive' } }
                  ]
                }
              }
            ]
          }
        } : {},

        clientAddressQuery ? {
          Address: {
            OR: [
              !isNaN(Number(clientAddressQuery)) ? { building_number: Number(clientAddressQuery) } : {},
              !isNaN(Number(clientAddressQuery)) ? { apartment_number: Number(clientAddressQuery) } : {},
              { street_name: { contains: clientAddressQuery, mode: 'insensitive' } },
              { city: { contains: clientAddressQuery, mode: 'insensitive' } },
              { country: { contains: clientAddressQuery, mode: 'insensitive' } }
            ]
          }
        } : {},
        orderTypeQuery ? {
          order: {
            order_type: {
              contains: orderTypeQuery,
              mode: 'insensitive'
            }
          }
        } : {},
        clientNameQuery ? {
          Client: {
            user: {
              OR: [
                { first_name: { contains: clientNameQuery, mode: 'insensitive' } },
                { last_name: { contains: clientNameQuery, mode: 'insensitive' } },
              ]
            }
          }
        } : {},
        (minCost !== undefined || maxCost !== undefined) ? {
          delivery_cost: {
            ...(minCost !== undefined ? { gte: minCost } : {}),
            ...(maxCost !== undefined ? { lte: maxCost } : {}),
          }
        } : {},
      ]
    };

    const [deliveries, total] = await Promise.all([
      this.prisma.delivery.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          start_time: 'desc',
        },
        include: {
          warehouse: {
            include: {
              address: true,
            }
          },
          Address: true,
          order: true,
          Client: {
            include: {
              user: true,
            }
          },
          courier: {
            include: {
              user: true,
            }
          },
        }
      }),
      this.prisma.delivery.count({
        where: whereClause
      })
    ]);

    if (!deliveries) {
      throw new NotFoundException(`No deliveries found for courier with ID ${id}`);
    }

    const totalPages = Math.ceil(total / limit);

    return {
      items: deliveries,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      }
    };
  }

  async getDeliveryByClientId(
    id: number,
    query: {
      deliveryType?: string;
      deliveryCost?: number;
      paymentMethod?: string;
      deliveryStatus?: string;
      startTime?: Date;
      endTime?: Date;
      warehouseAddressQuery?: string;
      clientAddressQuery?: string;
      orderTypeQuery?: string;
      courierNameQuery?: string;
      minCost?: number;
      maxCost?: number;
      page?: number;
      limit?: number;
    }
  ) {

    const {
      deliveryType,
      deliveryCost, paymentMethod, deliveryStatus, startTime, endTime, warehouseAddressQuery, clientAddressQuery, orderTypeQuery, courierNameQuery, minCost, maxCost, page = 1, limit = 10
    } = query;

    const skip = (page - 1) * limit;

    const whereClause: Prisma.DeliveryWhereInput = {
      AND: [
        { client_id: id },
        deliveryType ? {
          delivery_type: {
            contains: deliveryType,
            mode: Prisma.QueryMode.insensitive
          }
        } : {},
        deliveryCost !== undefined ? { delivery_cost: deliveryCost } : {},
        paymentMethod ? {
          payment_method: {
            contains: paymentMethod,
            mode: Prisma.QueryMode.insensitive
          }
        } : {},
        deliveryStatus ? {
          delivery_status: {
            contains: deliveryStatus,
            mode: Prisma.QueryMode.insensitive
          }
        } : {},
        startTime ? { start_time: { gte: startTime } } : {},
        endTime ? { end_time: { lte: endTime } } : {},
        warehouseAddressQuery ? {
          warehouse: {
            OR: [
              { name: { contains: warehouseAddressQuery, mode: 'insensitive' } },
              {
                address: {
                  OR: [
                    !isNaN(Number(warehouseAddressQuery)) ? { building_number: Number(warehouseAddressQuery) } : {},
                    !isNaN(Number(warehouseAddressQuery)) ? { apartment_number: Number(warehouseAddressQuery) } : {},
                    { street_name: { contains: warehouseAddressQuery, mode: 'insensitive' } },
                    { city: { contains: warehouseAddressQuery, mode: 'insensitive' } },
                    { country: { contains: warehouseAddressQuery, mode: 'insensitive' } }
                  ]
                }
              }
            ]
          }

        } : {},
        clientAddressQuery ? {
          Address: {
            OR: [
              !isNaN(Number(clientAddressQuery)) ? { building_number: Number(clientAddressQuery) } : {},
              !isNaN(Number(clientAddressQuery)) ? { apartment_number: Number(clientAddressQuery) } : {},
              { street_name: { contains: clientAddressQuery, mode: 'insensitive' } },
              { city: { contains: clientAddressQuery, mode: 'insensitive' } },
              { country: { contains: clientAddressQuery, mode: 'insensitive' } }
            ]
          }
        } : {},
        orderTypeQuery ? {
          order: {
            order_type: {
              contains: orderTypeQuery,
              mode: 'insensitive'
            }
          }
        } : {},
        courierNameQuery ? {
          courier: {
            user: {
              OR: [
                { first_name: { contains: courierNameQuery, mode: 'insensitive' } },
                { last_name: { contains: courierNameQuery, mode: 'insensitive' } },
              ]
            }
          }
        } : {},
        (minCost !== undefined || maxCost !== undefined) ? {
          delivery_cost: {
            ...(minCost !== undefined ? { gte: minCost } : {}),
            ...(maxCost !== undefined ? { lte: maxCost } : {}),
          }
        } : {},
      ]
    };

    const [deliveries, total] = await Promise.all([
      this.prisma.delivery.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          start_time: 'desc',
        },
        include: {
          warehouse: {
            include: {
              address: true,
            }
          },
          Address: true,
          order: true,
          Client: {
            include: {
              user: true,
            }
          },
          courier: {
            include: {
              user: true,
            }
          },
        }
      }),
      this.prisma.delivery.count({
        where: whereClause
      })
    ]);

    if (!deliveries) {
      throw new NotFoundException(`No deliveries found for client with ID ${id}`);
    }

    const totalPages = Math.ceil(total / limit);

    return {
      items: deliveries,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      }
    };
  }
}
