import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  getAllOrder(
    @Query('orderType') orderType?: string,
    @Query('description') description?: string,
    @Query('minCost') minCost?: string,
    @Query('maxCost') maxCost?: string,
    @Query('minWeight') minWeight?: string,
    @Query('maxWeight') maxWeight?: string,
    @Query('minLength') minLength?: string,
    @Query('maxLength') maxLength?: string,
    @Query('minWidth') minWidth?: string,
    @Query('maxWidth') maxWidth?: string,
    @Query('minHeight') minHeight?: string,
    @Query('maxHeight') maxHeight?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query = {
      orderType,
      description,
      paymentMethod,
      minCost: minCost ? parseFloat(minCost) : undefined,
      maxCost: maxCost ? parseFloat(maxCost) : undefined,
      minWeight: minWeight ? parseFloat(minWeight) : undefined,
      maxWeight: maxWeight ? parseFloat(maxWeight) : undefined,
      minLength: minLength ? parseFloat(minLength) : undefined,
      maxLength: maxLength ? parseFloat(maxLength) : undefined,
      minWidth: minWidth ? parseFloat(minWidth) : undefined,
      maxWidth: maxWidth ? parseFloat(maxWidth) : undefined,
      minHeight: minHeight ? parseFloat(minHeight) : undefined,
      maxHeight: maxHeight ? parseFloat(maxHeight) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };

    return this.orderService.getAllOrder(query);
  }


  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(+id);
  }

  @Put(':id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    console.log(updateOrderDto)
    return this.orderService.updateOrder(+id, updateOrderDto);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(+id);
  }
}
