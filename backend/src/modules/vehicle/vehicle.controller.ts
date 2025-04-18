import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from '@prisma/client';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @Post()
  createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }

  @Get()
  async getAllVehicles(
    @Query('licensePlate') licensePlate?: string,
    @Query('model') model?: string,
    @Query('transportType') transportType?: string,
    @Query('isCompanyOwner') isCompanyOwner?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Vehicle[]> {
    const query = {
      licensePlate,
      model,
      transportType,
      isCompanyOwner: isCompanyOwner !== undefined ? isCompanyOwner === 'true' : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.vehicleService.getAllVehicles(query);
  }

  @Get('company')
  getCompanyVehicles() {
    return this.vehicleService.getCompanyVehicles();
  }

  @Get(':vehicleId')
  async getVehicleById(@Param('vehicleId') vehicleId: string): Promise<Vehicle> {
    return this.vehicleService.getVehicleById(vehicleId);
  }

  @Put(':vehicleId')
  async updateVehicle(
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehicleService.updateVehicle(vehicleId, dto);
  }

  @Delete(':vehicleId')
  async deleteVehicle(@Param('vehicleId') vehicleId: string): Promise<{ message: string }> {
    return this.vehicleService.deleteVehicle(vehicleId);
  }
}
