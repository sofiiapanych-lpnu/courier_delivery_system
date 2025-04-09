import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) { }

  async createAddress(dto: CreateAddressDto) {
    return await this.prisma.address.create({
      data: {
        street_name: dto.streetName,
        building_number: dto.buildingNumber,
        apartment_number: dto.apartmentNumber,
        city: dto.city,
        country: dto.country,
      },
    });
  }

  async getAllAddress() {
    return this.prisma.address.findMany();
  }

  async getAddressById(id: number) {
    const address = await this.prisma.address.findUnique({
      where: { address_id: id },
    });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async updateAddress(id: number, dto: UpdateAddressDto) {
    const address = await this.prisma.address.findUnique({
      where: { address_id: id },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return this.prisma.address.update({
      where: { address_id: id },
      data: {
        street_name: dto.streetName,
        building_number: dto.buildingNumber,
        apartment_number: dto.apartmentNumber,
        city: dto.city,
        country: dto.country,
      },
    });
  }

  async deleteAddress(id: number) {
    const address = await this.prisma.address.findUnique({
      where: { address_id: id },
    });

    if (!address) {
      throw new Error(`Address with ID ${id} not found`);
    }

    await this.prisma.address.delete({
      where: { address_id: id },
    });

    return { message: `Address with ID ${id} deleted successfully` };
  }
}
