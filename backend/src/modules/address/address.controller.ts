import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  createAddress(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.createAddress(createAddressDto);
  }

  @Get()
  getAllAddress(
    @Query('streetName') streetName?: string,
    @Query('buildingNumber') buildingNumber?: string,
    @Query('apartmentNumber') apartmentNumber?: string,
    @Query('city') city?: string,
    @Query('country') country?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query = {
      streetName,
      buildingNumber: buildingNumber ? parseInt(buildingNumber, 10) : undefined,
      apartmentNumber: apartmentNumber ? parseInt(apartmentNumber, 10) : undefined,
      city,
      country,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    }
    return this.addressService.getAllAddress(query);
  }

  @Get(':id')
  getAddressById(@Param('id') id: string) {
    return this.addressService.getAddressById(+id);
  }

  @Put(':id')
  updateAddress(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.updateAddress(+id, updateAddressDto);
  }

  @Delete(':id')
  deleteAddress(@Param('id') id: string) {
    return this.addressService.deleteAddress(+id);
  }
}
