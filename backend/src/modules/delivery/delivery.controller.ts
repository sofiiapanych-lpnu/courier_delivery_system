import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) { }

  @Post()
  createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.createDelivery
      (createDeliveryDto);
  }

  @Get()
  getAllDelivery() {
    return this.deliveryService.getAllDelivery();
  }

  @Get(':id')
  getDeliveryById(@Param('id') id: string) {
    return this.deliveryService.getDeliveryById(+id);
  }

  @Put(':id')
  updateDelivery(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveryService.updateDelivery(+id, updateDeliveryDto);
  }

  @Delete(':id')
  deleteDelivery(@Param('id') id: string) {
    return this.deliveryService.deleteDelivery(+id);
  }
}
