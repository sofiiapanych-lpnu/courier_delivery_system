import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourierWeeklyScheduleDto } from './dto/create-courier-weekly-schedule.dto';
import { UpdateCourierWeeklyScheduleDto } from './dto/update-courier-weekly-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourierWeeklyScheduleService {
  constructor(private prisma: PrismaService) { }

  async createCourierWeeklySchedule(dto: CreateCourierWeeklyScheduleDto) {
    return await this.prisma.courierWeeklySchedule.create({
      data: {
        schedule_id: dto.schedule_id,
        day_of_week: dto.day_of_week,
        start_time: dto.start_time,
        end_time: dto.end_time,
        is_working_day: dto.is_working_day,
      },
    });
  }

  async getAllCourierWeeklySchedule() {
    return this.prisma.courierWeeklySchedule.findMany();
  }

  async getCourierWeeklyScheduleById(id: number) {
    const address = await this.prisma.courierWeeklySchedule.findUnique({
      where: { schedule_id: id },
    });
    if (!address) {
      throw new NotFoundException(`Weekly Schedule with ID ${id} not found`);
    }
    return address;
  }

  async updateCourierWeeklySchedule(id: number, dto: UpdateCourierWeeklyScheduleDto) {
    const address = await this.prisma.courierWeeklySchedule.findUnique({
      where: { schedule_id: id },
    });

    if (!address) {
      throw new NotFoundException(`Weekly Schedule with ID ${id} not found`);
    }

    return this.prisma.courierWeeklySchedule.update({
      where: { schedule_id: id },
      data: {
        schedule_id: dto.schedule_id,
        day_of_week: dto.day_of_week,
        start_time: dto.start_time,
        end_time: dto.end_time,
        is_working_day: dto.is_working_day,
      },
    });
  }

  async deleteCourierWeeklySchedule(id: number) {
    const address = await this.prisma.courierWeeklySchedule.findUnique({
      where: { schedule_id: id },
    });

    if (!address) {
      throw new Error(`Weekly Schedule with ID ${id} not found`);
    }

    await this.prisma.courierWeeklySchedule.delete({
      where: { schedule_id: id },
    });

    return { message: `Weekly Schedule with ID ${id} deleted successfully` };
  }
}
