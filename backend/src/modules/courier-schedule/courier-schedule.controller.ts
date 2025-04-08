import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourierScheduleService } from './courier-schedule.service';
import { CreateCourierScheduleDto } from './dto/create-courier-schedule.dto';
import { UpdateCourierScheduleDto } from './dto/update-courier-schedule.dto';

@Controller('courier-schedule')
export class CourierScheduleController {
  constructor(private readonly courierScheduleService: CourierScheduleService) {}

  @Post()
  create(@Body() createCourierScheduleDto: CreateCourierScheduleDto) {
    return this.courierScheduleService.create(createCourierScheduleDto);
  }

  @Get()
  findAll() {
    return this.courierScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courierScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourierScheduleDto: UpdateCourierScheduleDto) {
    return this.courierScheduleService.update(+id, updateCourierScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courierScheduleService.remove(+id);
  }
}
