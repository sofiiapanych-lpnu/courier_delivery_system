import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourierScheduleDto } from './dto/create-courier-schedule.dto';
import { UpdateCourierScheduleDto } from './dto/update-courier-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourierSchedule } from '@prisma/client';

@Injectable()
export class CourierScheduleService {
  constructor(private prisma: PrismaService) { }

  async createCourierSchedule(dto: CreateCourierScheduleDto): Promise<CourierSchedule> {
    return await this.prisma.courierSchedule.create({
      data: {
        courier_id: dto.courierId,
        schedule_status: dto.scheduleStatus,
      },
    });
  }

  async getAllCourierSchedule(query: {
    courierId?: number;
    scheduleStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<CourierSchedule[]> {
    const { courierId, scheduleStatus, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    return this.prisma.courierSchedule.findMany({
      where: {
        AND: [
          courierId !== undefined ? { courier_id: courierId } : {},
          scheduleStatus ? { schedule_status: { contains: scheduleStatus, mode: 'insensitive' } } : {},
        ]
      }
      ,
      skip,
      take: limit,
    });
  }

  async getCourierScheduleById(id: number): Promise<CourierSchedule> {
    const courierSchedule = await this.prisma.courierSchedule.findUnique({
      where: { schedule_id: id },
    });
    if (!courierSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return courierSchedule;
  }

  async updateCourierSchedule(id: number, dto: UpdateCourierScheduleDto): Promise<CourierSchedule> {
    const courierSchedule = await this.prisma.courierSchedule.findUnique({
      where: { schedule_id: id },
    });

    if (!courierSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return this.prisma.courierSchedule.update({
      where: { schedule_id: id },
      data: {
        courier_id: dto.courierId,
        schedule_status: dto.scheduleStatus,
      },
    });
  }

  async deleteCourierSchedule(id: number): Promise<{ message: string }> {
    const courierSchedule = await this.prisma.courierSchedule.findUnique({
      where: { schedule_id: id },
    });

    if (!courierSchedule) {
      throw new Error(`Schedule with ID ${id} not found`);
    }

    await this.prisma.courierSchedule.delete({
      where: { schedule_id: id },
    });

    return { message: `Schedule with ID ${id} deleted successfully` };
  }
}
