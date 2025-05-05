import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateClientDto, UpdateClientDto } from "./dto";
import { Address, Client, Prisma } from "@prisma/client";
import { UpdateAddressDto } from "src/modules/address/dto/update-address.dto";

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

  async getAllClients(query: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    page?: number;
    limit?: number;
  }): Promise<Client[]> {
    const { firstName, lastName, phoneNumber, email, page = 1, limit = 10, } = query;
    const skip = (page - 1) * limit;

    return this.prisma.client.findMany({
      where: {
        user: {
          AND: [
            firstName ? { first_name: { contains: firstName, mode: 'insensitive' } } : {},
            lastName ? { last_name: { contains: lastName, mode: 'insensitive' } } : {},
            phoneNumber ? { phone_number: { contains: phoneNumber, mode: 'insensitive' } } : {},
            email ? { email: { contains: email, mode: 'insensitive' } } : {},
          ]
        }
      },
      skip,
      take: limit,
      include: {
        user: true,
      },
    });
  }

  async getClientById(id: number): Promise<Client> {
    const client = await this.prisma.client.findUnique({
      where: { client_id: id },
      include: {
        address: true,
      }
    });

    if (!client) {
      throw new Error(`Client with ID ${id} not found`);
    }

    return client;
  }

  async getClientByUserId(id: number): Promise<Client> {
    const client = await this.prisma.client.findUnique({
      where: { user_id: id },
    });

    if (!client) {
      throw new Error(`Client with User ID ${id} not found`);
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

  async updateClientAddress(clientId: number, dto: UpdateAddressDto): Promise<Address> {
    const client = await this.prisma.client.findUnique({
      where: { client_id: clientId },
      include: { address: true },
    });

    if (!client) {
      throw new Error(`Client not found`);
    }

    if (!client.address_id) {
      if (!dto.country || !dto.city || !dto.streetName || !dto.buildingNumber) {
        throw new Error('Missing required address fields for creation');
      }

      const newAddress = await this.prisma.address.create({
        data: {
          country: dto.country,
          city: dto.city,
          street_name: dto.streetName,
          building_number: dto.buildingNumber,
          apartment_number: dto.apartmentNumber || null,
        },
      });

      await this.prisma.client.update({
        where: { client_id: clientId },
        data: { address_id: newAddress.address_id },
      });

      return newAddress;
    }


    const updatedAddress = await this.prisma.address.update({
      where: { address_id: client.address_id },
      data: {
        country: dto.country,
        city: dto.city,
        street_name: dto.streetName,
        building_number: dto.buildingNumber,
        apartment_number: dto.apartmentNumber || null,
      },
    });

    return updatedAddress;
  }
}
