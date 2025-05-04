import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressInput } from './dto/create-address.input';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.address.findMany();
  }

  async findOne(address_id: number) {
    return this.prisma.address.findUnique({
      where: { address_id },
    });
  }

  async create(data: CreateAddressInput) {
    return this.prisma.address.create({
      data,
    });
  }
}
