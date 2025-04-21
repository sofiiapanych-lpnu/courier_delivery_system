import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CourierScheduleService } from './courier-schedule.service';
import { CreateCourierScheduleDto } from './dto/create-courier-schedule.dto';
import { UpdateCourierScheduleDto } from './dto/update-courier-schedule.dto';

@Controller('courier-schedule')
export class CourierScheduleController {
  constructor(private readonly courierScheduleService: CourierScheduleService) { }

  @Post()
  createCourierSchedule(@Body() createCourierScheduleDto: CreateCourierScheduleDto) {
    console.log('createCourierScheduleDto', createCourierScheduleDto)
    return this.courierScheduleService.createCourierSchedule(createCourierScheduleDto);
  }

  @Get()
  getAllCourierSchedule(
    @Query('courierName') courierName?: string,
    @Query('scheduleStatus') scheduleStatus?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('mondayStart') mondayStart?: string,
    @Query('mondayEnd') mondayEnd?: string,
    @Query('tuesdayStart') tuesdayStart?: string,
    @Query('tuesdayEnd') tuesdayEnd?: string,
    @Query('wednesdayStart') wednesdayStart?: string,
    @Query('wednesdayEnd') wednesdayEnd?: string,
    @Query('thursdayStart') thursdayStart?: string,
    @Query('thursdayEnd') thursdayEnd?: string,
    @Query('fridayStart') fridayStart?: string,
    @Query('fridayEnd') fridayEnd?: string,
    @Query('saturdayStart') saturdayStart?: string,
    @Query('saturdayEnd') saturdayEnd?: string,
    @Query('sundayStart') sundayStart?: string,
    @Query('sundayEnd') sundayEnd?: string,
  ) {
    const query = {
      courierName,
      scheduleStatus,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      mondayStart,
      mondayEnd,
      tuesdayStart,
      tuesdayEnd,
      wednesdayStart,
      wednesdayEnd,
      thursdayStart,
      thursdayEnd,
      fridayStart,
      fridayEnd,
      saturdayStart,
      saturdayEnd,
      sundayStart,
      sundayEnd,
    };

    return this.courierScheduleService.getAllCourierSchedule(query);
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
