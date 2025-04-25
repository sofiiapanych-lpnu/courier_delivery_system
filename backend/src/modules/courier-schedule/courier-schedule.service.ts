import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourierScheduleDto } from './dto/create-courier-schedule.dto';
import { UpdateCourierScheduleDto } from './dto/update-courier-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourierSchedule, Prisma } from '@prisma/client';

@Injectable()
export class CourierScheduleService {
  constructor(private prisma: PrismaService) { }

  async createCourierSchedule(dto: CreateCourierScheduleDto): Promise<CourierSchedule> {
    return await this.prisma.$transaction(async (tx) => {
      const schedule = await tx.courierSchedule.create({
        data: {
          courier_id: dto.courierId,
          schedule_status: dto.scheduleStatus,
        },
      });

      const providedDaysMap = new Map(
        (dto.weeklySchedule ?? []).map(ws => [ws.dayOfWeek, ws])
      );

      const weeklySchedules = Array.from({ length: 7 }, (_, index) => {
        const ws = providedDaysMap.get(index);
        return {
          schedule_id: schedule.schedule_id,
          day_of_week: index,
          is_working_day: ws?.isWorkingDay ?? false,
          start_time: ws?.startTime ?? null,
          end_time: ws?.endTime ?? null,
        };
      });

      await tx.courierWeeklySchedule.createMany({
        data: weeklySchedules,
      });

      const fullSchedule = await tx.courierSchedule.findUnique({
        where: { schedule_id: schedule.schedule_id },
        include: {
          CourierWeeklySchedule: true,
        },
      });

      if (!fullSchedule) {
        throw new Error('Schedule not found after creation');
      }

      return fullSchedule;
    });
  }

  async getAllCourierSchedule(query: {
    courierName?: string;
    scheduleStatus?: string;
    mondayStart?: string;
    mondayEnd?: string;
    tuesdayStart?: string;
    tuesdayEnd?: string;
    wednesdayStart?: string;
    wednesdayEnd?: string;
    thursdayStart?: string;
    thursdayEnd?: string;
    fridayStart?: string;
    fridayEnd?: string;
    saturdayStart?: string;
    saturdayEnd?: string;
    sundayStart?: string;
    sundayEnd?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: CourierSchedule[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const {
      courierName,
      scheduleStatus,
      mondayStart, mondayEnd,
      tuesdayStart, tuesdayEnd,
      wednesdayStart, wednesdayEnd,
      thursdayStart, thursdayEnd,
      fridayStart, fridayEnd,
      saturdayStart, saturdayEnd,
      sundayStart, sundayEnd,
      page = 1,
      limit = 10
    } = query;

    const skip = (page - 1) * limit;

    const dayFilters = [
      { index: 1, start: mondayStart, end: mondayEnd },
      { index: 2, start: tuesdayStart, end: tuesdayEnd },
      { index: 3, start: wednesdayStart, end: wednesdayEnd },
      { index: 4, start: thursdayStart, end: thursdayEnd },
      { index: 5, start: fridayStart, end: fridayEnd },
      { index: 6, start: saturdayStart, end: saturdayEnd },
      { index: 0, start: sundayStart, end: sundayEnd },
    ];

    const dayConditions = dayFilters.flatMap(({ index, start, end }) => {
      if (start || end) {
        return [{
          CourierWeeklySchedule: {
            some: {
              day_of_week: index,
              ...(start ? { start_time: { gte: new Date(`1970-01-01T${start}:00Z`) } } : {}),
              ...(end ? { end_time: { lte: new Date(`1970-01-01T${end}:00Z`) } } : {}),
            }
          }
        }];
      }
      return [];
    });

    const courierNameCondition: Prisma.CourierScheduleWhereInput = courierName
      ? {
        courier: {
          user: {
            OR: [
              {
                first_name: {
                  contains: query.courierName,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                last_name: {
                  contains: query.courierName,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              ...(courierName.split(' ').length === 2
                ? [{
                  AND: [
                    {
                      first_name: {
                        contains: courierName.split(' ')[0],
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                    {
                      last_name: {
                        contains: courierName.split(' ')[1],
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  ]
                }]
                : [])
            ]
          }
        }
      }
      : {};

    const whereClause: Prisma.CourierScheduleWhereInput = {
      AND: [
        scheduleStatus ? { schedule_status: { contains: scheduleStatus, mode: 'insensitive' } } : {},
        ...dayConditions,
        courierNameCondition,
      ]
    };

    const [schedules, total] = await Promise.all([
      this.prisma.courierSchedule.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          CourierWeeklySchedule: true,
          courier: {
            include: {
              user: true,
            }
          }
        },
        orderBy: [
          {
            schedule_status: 'asc',
          },
          {
            created_at: 'desc',
          }
        ],
      }),
      this.prisma.courierSchedule.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: schedules,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      },
    };
  }

  async getCourierScheduleById(id: number): Promise<CourierSchedule> {
    const courierSchedule = await this.prisma.courierSchedule.findUnique({
      where: { schedule_id: id },
      include: {
        CourierWeeklySchedule: true,
        courier: {
          include: {
            user: true,
          }
        }
      }
    });
    if (!courierSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return courierSchedule;
  }

  async getScheduleByCourierId(
    courierId: number,
    query: {
      page?: number;
      limit?: number;
    }
  ): Promise<{
    items: CourierSchedule[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const {
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const whereClause: Prisma.CourierScheduleWhereInput = {
      courier_id: courierId,
    };

    const [schedules, total] = await Promise.all([
      this.prisma.courierSchedule.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          CourierWeeklySchedule: true,
          courier: {
            include: {
              user: true,
            },
          },
        },
        orderBy: [
          { created_at: 'desc' },
        ],
      }),
      this.prisma.courierSchedule.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: schedules,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      },
    };
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
      include: {
        CourierWeeklySchedule: true,
        courier: {
          include: {
            user: true,
          }
        }
      }
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
