import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
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
  getAllDelivery(
    @Query('orderId') orderId?: string,
    @Query('courierId') courierId?: string,
    @Query('clientId') clientId?: string,
    @Query('addressId') addressId?: string,
    @Query('deliveryType') deliveryType?: string,
    @Query('deliveryCost') deliveryCost?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('deliveryStatus') deliveryStatus?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('desiredDuration') desiredDuration?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query = {
      orderId: orderId ? parseInt(orderId, 10) : undefined,
      courierId: courierId ? parseInt(courierId, 10) : undefined,
      clientId: clientId ? parseInt(clientId, 10) : undefined,
      addressId: addressId ? parseInt(addressId, 10) : undefined,
      deliveryType,
      deliveryCost: deliveryCost ? parseFloat(deliveryCost) : undefined,
      paymentMethod,
      deliveryStatus,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      desiredDuration: desiredDuration ? parseFloat(desiredDuration) : undefined,
      warehouseId: warehouseId ? parseInt(warehouseId, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.deliveryService.getAllDelivery(query);
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
