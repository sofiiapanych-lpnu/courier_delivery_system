import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CourierScheduleService } from './courier-schedule.service';
import { CreateCourierScheduleDto } from './dto/create-courier-schedule.dto';
import { UpdateCourierScheduleDto } from './dto/update-courier-schedule.dto';

@Controller('courier-schedule')
export class CourierScheduleController {
  constructor(private readonly courierScheduleService: CourierScheduleService) { }

  @Post()
  createCourierSchedule(@Body() createCourierScheduleDto: CreateCourierScheduleDto) {
    return this.courierScheduleService.createCourierSchedule(createCourierScheduleDto);
  }

  @Get()
  getAllCourierSchedule() {
    return this.courierScheduleService.getAllCourierSchedule();
  }

  @Get(':id')
  getCourierScheduleById(@Param('id') id: string) {
    return this.courierScheduleService.getCourierScheduleById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourierScheduleDto: UpdateCourierScheduleDto) {
    return this.courierScheduleService.updateCourierSchedule(+id, updateCourierScheduleDto);
  }

  @Delete(':id')
  deleteCourierSchedule(@Param('id') id: string) {
    return this.courierScheduleService.deleteCourierSchedule(+id);
  }
}
