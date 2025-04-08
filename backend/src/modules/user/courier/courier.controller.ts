import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourierService } from './courier.service';
import { CreateCourierDto, UpdateCourierDto } from './dto';

@Controller('courier')
export class CourierController {
  constructor(
    private readonly courierService: CourierService,
    private readonly prisma: PrismaService
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
  async getAllCouriers() {
    return this.courierService.getAllCouriers();
  }

  @Get(':id')
  async getCourierById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.courierService.getCourierById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async updateCourier(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourierDto
  ) {
    try {
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
