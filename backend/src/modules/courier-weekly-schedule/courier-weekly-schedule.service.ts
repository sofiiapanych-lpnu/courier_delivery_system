import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourierWeeklyScheduleDto } from './dto/create-courier-weekly-schedule.dto';
import { UpdateCourierWeeklyScheduleDto } from './dto/update-courier-weekly-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourierWeeklySchedule, Prisma } from '@prisma/client';

@Injectable()
export class CourierWeeklyScheduleService {
  constructor(private prisma: PrismaService) { }

  async createCourierWeeklySchedule(dto: CreateCourierWeeklyScheduleDto): Promise<CourierWeeklySchedule> {
    return await this.prisma.courierWeeklySchedule.create({
      data: {
        schedule_id: dto.scheduleId,
        day_of_week: dto.dayOfWeek,
        start_time: dto.startTime ? new Date(dto.startTime) : null,
        end_time: dto.endTime ? new Date(dto.endTime) : null,
        is_working_day: dto.isWorkingDay,
      },
    });
  }

  async getAllCourierWeeklySchedule(query: {
    scheduleId?: number;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    isWorkingDay?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    items: CourierWeeklySchedule[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { scheduleId, dayOfWeek, startTime, endTime, isWorkingDay, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.CourierWeeklyScheduleWhereInput = {
      AND: [
        scheduleId !== undefined ? { schedule_id: scheduleId } : {},
        dayOfWeek !== undefined ? { day_of_week: dayOfWeek } : {},
        startTime ? { start_time: { equals: new Date(startTime) } } : {},
        endTime ? { end_time: { equals: new Date(endTime) } } : {},
        isWorkingDay !== undefined ? { is_working_day: isWorkingDay } : {},
      ],
    };

    const [weeklySchedules, total] = await Promise.all([
      this.prisma.courierWeeklySchedule.findMany({
        where: whereClause,
        skip,
        take: limit,
      }),
      this.prisma.courierWeeklySchedule.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: weeklySchedules,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      },
    };
  }


  async getCourierWeeklyScheduleById(id: number): Promise<CourierWeeklySchedule> {
    const weeklySchedule = await this.prisma.courierWeeklySchedule.findUnique({
      where: { weekly_id: id },
    });
    if (!weeklySchedule) {
      throw new NotFoundException(`Weekly Schedule with ID ${id} not found`);
    }
    return weeklySchedule;
  }

  async updateCourierWeeklySchedule(id: number, dto: UpdateCourierWeeklyScheduleDto): Promise<CourierWeeklySchedule> {
    const weeklySchedule = await this.prisma.courierWeeklySchedule.findUnique({
      where: { weekly_id: id },
    });

    if (!weeklySchedule) {
      throw new NotFoundException(`Weekly Schedule with ID ${id} not found`);
    }

    return this.prisma.courierWeeklySchedule.update({
      where: { weekly_id: id },
      data: {
        schedule_id: dto.scheduleId,
        day_of_week: dto.dayOfWeek,
        start_time: dto.startTime,
        end_time: dto.endTime,
        is_working_day: dto.isWorkingDay,
      },
    });
  }

  async deleteCourierWeeklySchedule(id: number): Promise<{ message: string }> {
    const weeklySchedule = await this.prisma.courierWeeklySchedule.findUnique({
      where: { weekly_id: id },
    });

    if (!weeklySchedule) {
      throw new Error(`Weekly Schedule with ID ${id} not found`);
    }

    await this.prisma.courierWeeklySchedule.delete({
      where: { weekly_id: id },
    });

    return { message: `Weekly Schedule with ID ${id} deleted successfully` };
  }
}
