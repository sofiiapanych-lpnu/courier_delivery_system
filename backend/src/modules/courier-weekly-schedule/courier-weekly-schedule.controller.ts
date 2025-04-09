import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
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
  getAllCourierWeeklySchedule() {
    return this.courierWeeklyScheduleService.getAllCourierWeeklySchedule();
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
