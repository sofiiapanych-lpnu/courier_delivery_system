import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourierService } from './courier.service';
import { CreateCourierDto, UpdateCourierDto } from './dto';
import { DeliveryService } from 'src/modules/delivery/delivery.service';

@Controller('courier')
export class CourierController {
  constructor(
    private readonly courierService: CourierService,
    private readonly prisma: PrismaService,
    private readonly deliveryService: DeliveryService
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

  @Get(':id')
  async getCourierById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.courierService.getCourierById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':courierId/deliveries')
  getDeliveryByCourierId(@Param('courierId') id: string) {
    return this.deliveryService.getDeliveryByCourierId(+id);
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

  // @Put(':id')
  // async updateCourierVehicle(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() dto: UpdateCourierDto
  // ) {
  //   try {
  //     return await this.courierService.updateCourier(id, dto);
  //   } catch (error) {
  //     throw new HttpException(
  //       `Failed to update courier: ${error.message}`,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }
  // }
}
