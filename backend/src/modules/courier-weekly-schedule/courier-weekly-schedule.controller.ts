import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourierWeeklyScheduleService } from './courier-weekly-schedule.service';
import { CreateCourierWeeklyScheduleDto } from './dto/create-courier-weekly-schedule.dto';
import { UpdateCourierWeeklyScheduleDto } from './dto/update-courier-weekly-schedule.dto';

@Controller('courier-weekly-schedule')
export class CourierWeeklyScheduleController {
  constructor(private readonly courierWeeklyScheduleService: CourierWeeklyScheduleService) {}

  @Post()
  create(@Body() createCourierWeeklyScheduleDto: CreateCourierWeeklyScheduleDto) {
    return this.courierWeeklyScheduleService.create(createCourierWeeklyScheduleDto);
  }

  @Get()
  findAll() {
    return this.courierWeeklyScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courierWeeklyScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourierWeeklyScheduleDto: UpdateCourierWeeklyScheduleDto) {
    return this.courierWeeklyScheduleService.update(+id, updateCourierWeeklyScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courierWeeklyScheduleService.remove(+id);
  }
}
