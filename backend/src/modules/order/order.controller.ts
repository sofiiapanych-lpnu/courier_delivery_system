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
    @Query('cost') cost?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('weight') weight?: string,
    @Query('length') length?: string,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query = {
      orderType,
      description,
      cost: cost ? parseInt(cost, 10) : undefined,
      paymentMethod,
      weight: weight ? parseInt(weight, 10) : undefined,
      length: length ? parseInt(length, 10) : undefined,
      width: width ? parseInt(width, 10) : undefined,
      height: height ? parseInt(height, 10) : undefined,
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
    return this.orderService.updateOrder(+id, updateOrderDto);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(+id);
  }
}
