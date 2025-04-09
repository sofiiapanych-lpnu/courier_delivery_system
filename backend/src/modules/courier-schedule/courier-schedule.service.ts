import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourierScheduleDto } from './dto/create-courier-schedule.dto';
import { UpdateCourierScheduleDto } from './dto/update-courier-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourierScheduleService {
  constructor(private prisma: PrismaService) { }

  async createCourierSchedule(dto: CreateCourierScheduleDto) {
    return await this.prisma.courierSchedule.create({
      data: {
        courier_id: dto.courierId,
        schedule_status: dto.scheduleStatus,
      },
    });
  }

  async getAllCourierSchedule() {
    return this.prisma.courierSchedule.findMany();
  }

  async getCourierScheduleById(id: number) {
    const courierSchedule = await this.prisma.courierSchedule.findUnique({
      where: { schedule_id: id },
    });
    if (!courierSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return courierSchedule;
  }

  async updateCourierSchedule(id: number, dto: UpdateCourierScheduleDto) {
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

  async deleteCourierSchedule(id: number) {
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
