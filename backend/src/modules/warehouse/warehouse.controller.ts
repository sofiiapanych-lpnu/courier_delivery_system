import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) { }

  @Post()
  createWarehouse(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.createWarehouse(createWarehouseDto);
  }

  @Get()
  getAllWarehouse(
    @Query('name') name?: string,
    @Query('contactNumber') contactNumber?: string,
    @Query('address') address?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.warehouseService.getAllWarehouse({
      name,
      contactNumber,
      address,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get(':id')
  getWarehouseById(@Param('id') id: string) {
    return this.warehouseService.getWarehouseById(+id);
  }

  @Put(':id')
  updateWarehouse(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehouseService.updateWarehouse(+id, updateWarehouseDto);
  }

  @Delete(':id')
  deleteWarehouse(@Param('id') id: string) {
    return this.warehouseService.deleteWarehouse(+id);
  }
}
