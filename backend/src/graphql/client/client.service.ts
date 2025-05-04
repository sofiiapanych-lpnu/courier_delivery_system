import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.client.findMany({
      include: {
        user: true,
        address: true,
      },
    });
  }

  async findOne(client_id: number) {
    return this.prisma.client.findUnique({
      where: { client_id },
      include: {
        user: true,
        address: true,
      },
    });
  }
}
