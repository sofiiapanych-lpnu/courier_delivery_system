import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from '@prisma/client';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @Post('createVehicle')
  createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }

  @Get()
  async getAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleService.getAllVehicles();
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
