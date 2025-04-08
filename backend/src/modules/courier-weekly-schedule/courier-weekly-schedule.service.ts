import { Injectable } from '@nestjs/common';
import { CreateCourierWeeklyScheduleDto } from './dto/create-courier-weekly-schedule.dto';
import { UpdateCourierWeeklyScheduleDto } from './dto/update-courier-weekly-schedule.dto';

@Injectable()
export class CourierWeeklyScheduleService {
  create(createCourierWeeklyScheduleDto: CreateCourierWeeklyScheduleDto) {
    return 'This action adds a new courierWeeklySchedule';
  }

  findAll() {
    return `This action returns all courierWeeklySchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courierWeeklySchedule`;
  }

  update(id: number, updateCourierWeeklyScheduleDto: UpdateCourierWeeklyScheduleDto) {
    return `This action updates a #${id} courierWeeklySchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} courierWeeklySchedule`;
  }
}
