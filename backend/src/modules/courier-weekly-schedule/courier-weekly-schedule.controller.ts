import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CourierWeeklyScheduleService } from './courier-weekly-schedule.service';
import { CreateCourierWeeklyScheduleDto } from './dto/create-courier-weekly-schedule.dto';
import { UpdateCourierWeeklyScheduleDto } from './dto/update-courier-weekly-schedule.dto';

@Controller('courier-weekly-schedule')
export class CourierWeeklyScheduleController {
  constructor(private readonly courierWeeklyScheduleService: CourierWeeklyScheduleService) { }

  @Post()
  createCourierWeeklySchedule(@Body() createCourierWeeklyScheduleDto: CreateCourierWeeklyScheduleDto) {
    return this.courierWeeklyScheduleService.createCourierWeeklySchedule(createCourierWeeklyScheduleDto);
  }

  @Get()
  getAllCourierWeeklySchedule(
    @Query('scheduleId') scheduleId?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('isWorkingDay') isWorkingDay?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query = {
      scheduleId: scheduleId ? parseInt(scheduleId, 10) : undefined,
      dayOfWeek: dayOfWeek ? parseInt(dayOfWeek, 10) : undefined,
      startTime: startTime ? new Date(startTime).toISOString() : undefined,
      endTime: endTime ? new Date(endTime).toISOString() : undefined,
      isWorkingDay: isWorkingDay !== undefined ? isWorkingDay === 'true' : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    };
    return this.courierWeeklyScheduleService.getAllCourierWeeklySchedule(query);
  }

  @Get(':id')
  getCourierWeeklyScheduleById(@Param('id') id: string) {
    return this.courierWeeklyScheduleService.getCourierWeeklyScheduleById(+id);
  }

  @Put(':id')
  updateCourierWeeklySchedule(@Param('id') id: string, @Body() updateCourierWeeklyScheduleDto: UpdateCourierWeeklyScheduleDto) {
    return this.courierWeeklyScheduleService.updateCourierWeeklySchedule(+id, updateCourierWeeklyScheduleDto);
  }

  @Delete(':id')
  deleteCourierWeeklySchedule(@Param('id') id: string) {
    return this.courierWeeklyScheduleService.deleteCourierWeeklySchedule(+id);
  }
}
