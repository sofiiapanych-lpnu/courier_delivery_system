import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
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
  getAllAddress() {
    return this.addressService.getAllAddress();
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
