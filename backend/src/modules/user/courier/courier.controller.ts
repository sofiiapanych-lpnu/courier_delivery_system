import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourierService } from './courier.service';
import { CreateCourierDto, UpdateCourierDto } from './dto';
import { DeliveryService } from 'src/modules/delivery/delivery.service';
import { FeedbackService } from 'src/modules/feedback/feedback.service';
import { CourierScheduleService } from 'src/modules/courier-schedule/courier-schedule.service';

@Controller('courier')
export class CourierController {
  constructor(
    private readonly courierService: CourierService,
    private readonly prisma: PrismaService,
    private readonly deliveryService: DeliveryService,
    private readonly feedbackService: FeedbackService,
    private readonly scheduleService: CourierScheduleService,
  ) { }

  @Post()
  async createCourier(@Body() dto: CreateCourierDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        return this.courierService.createCourier(dto, tx);
      });
    } catch (error) {
      throw new HttpException(
        `Failed to create courier: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async getAllCouriers(
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('email') email?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query = {
      firstName,
      lastName,
      phoneNumber,
      email,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    }
    return this.courierService.getAllCouriers(query);
  }

  @Get('statistics')
  async getCourierStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('courierId') courierId?: string,
    @Query('groupBy') groupBy?: string,
  ) {
    const validGroupBy: 'year' | 'month' | 'day' | undefined =
      groupBy === 'year' || groupBy === 'month' || groupBy === 'day' ? groupBy : undefined;

    const query = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      courierId: courierId ? parseInt(courierId, 10) : undefined,
      groupBy: validGroupBy,
    };

    return this.courierService.getCourierStatistics(query);
  }

  @Get(':id')
  async getCourierById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.courierService.getCourierById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':courierId/deliveries')
  getDeliveryByCourierId(
    @Param('courierId') id: string,
    @Query('deliveryType') deliveryType?: string,
    @Query('deliveryCost') deliveryCost?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('deliveryStatus') deliveryStatus?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('warehouseAddressQuery') warehouseAddressQuery?: string,
    @Query('clientAddressQuery') clientAddressQuery?: string,
    @Query('orderTypeQuery') orderTypeQuery?: string,
    @Query('clientNameQuery') clientNameQuery?: string,
    @Query('minCost') minCost?: string,
    @Query('maxCost') maxCost?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const query = {
      deliveryType,
      deliveryCost: deliveryCost ? parseFloat(deliveryCost) : undefined,
      paymentMethod,
      deliveryStatus,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      warehouseAddressQuery,
      clientAddressQuery,
      orderTypeQuery,
      clientNameQuery,
      minCost: minCost ? parseFloat(minCost) : undefined,
      maxCost: maxCost ? parseFloat(maxCost) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.deliveryService.getDeliveryByCourierId(+id, query);
  }

  @Get(':courierId/feedbacks')
  async getFeedbackByCourierId(
    @Param('courierId') id: string,
    @Query('clientName') clientName?: string,
    @Query('rating') rating?: string,
    @Query('hasComment') hasComment?: string,
    @Query('comment') comment?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const numericId = parseInt(id, 10);

    const query = {
      clientName,
      rating: rating ? parseInt(rating, 10) : undefined,
      hasComment,
      comment,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };

    return this.feedbackService.getFeedbackByClientId(numericId, query);
  }

  @Get(':courierId/schedule')
  async getScheduleByCourierId(
    @Param('courierId') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const numericId = parseInt(id, 10);

    const query = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };

    return this.scheduleService.getScheduleByCourierId(numericId, query);
  }

  @Put(':id')
  async updateCourier(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourierDto
  ) {
    try {
      console.log('updateCourier dto', dto, id)
      return await this.courierService.updateCourier(id, dto);
    } catch (error) {
      throw new HttpException(
        `Failed to update courier: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async deleteCourier(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.courierService.deleteCourier(id);
    } catch (error) {
      throw new HttpException(
        `Failed to delete courier: ${error.message}`,
        HttpStatus.NOT_FOUND
      );
    }
  }
}
