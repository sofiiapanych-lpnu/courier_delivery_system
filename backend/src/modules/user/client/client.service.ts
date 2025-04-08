import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateClientDto, UpdateClientDto } from "./dto";
import { Client, Prisma } from "@prisma/client";

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) { }

  async createClient(dto: CreateClientDto, tx: Prisma.TransactionClient): Promise<Client> {
    return tx.client.create({
      data: {
        user_id: dto.userId,
        address_id: dto.addressId,
      },
    });
  }

  async getAllClients(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }

  async getClientById(id: number): Promise<Client> {
    const client = await this.prisma.client.findUnique({
      where: { client_id: id },
    });

    if (!client) {
      throw new Error(`Client with ID ${id} not found`);
    }

    return client;
  }

  async updateClient(id: number, dto: UpdateClientDto): Promise<Client> {
    const client = await this.prisma.client.findUnique({
      where: { client_id: id },
    });

    if (!client) {
      throw new Error(`Client with ID ${id} not found`);
    }

    return this.prisma.client.update({
      where: { client_id: id },
      data: {
        address_id: dto.addressId,
      },
    });
  }

  async deleteClient(id: number): Promise<{ message: string }> {
    const client = await this.prisma.client.findUnique({
      where: { client_id: id },
    });

    if (!client) {
      throw new Error(`Client with ID ${id} not found`);
    }

    await this.prisma.client.delete({
      where: { client_id: id },
    });

    return { message: `Client with ID ${id} deleted successfully` };
  }
}
