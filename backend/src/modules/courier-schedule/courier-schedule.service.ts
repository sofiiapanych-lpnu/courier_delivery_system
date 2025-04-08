import { Injectable } from '@nestjs/common';
import { CreateCourierScheduleDto } from './dto/create-courier-schedule.dto';
import { UpdateCourierScheduleDto } from './dto/update-courier-schedule.dto';

@Injectable()
export class CourierScheduleService {
  create(createCourierScheduleDto: CreateCourierScheduleDto) {
    return 'This action adds a new courierSchedule';
  }

  findAll() {
    return `This action returns all courierSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courierSchedule`;
  }

  update(id: number, updateCourierScheduleDto: UpdateCourierScheduleDto) {
    return `This action updates a #${id} courierSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} courierSchedule`;
  }
}
