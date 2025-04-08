import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dto';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly prisma: PrismaService,
  ) { }

  @Post()
  async createClient(@Body() dto: CreateClientDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        return this.clientService.createClient(dto, tx);
      });
    } catch (error) {
      throw new HttpException(
        `Failed to create client: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async getAllClients() {
    return this.clientService.getAllClients();
  }

  @Get(':id')
  async getClientById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.clientService.getClientById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClientDto,
  ) {
    try {
      return await this.clientService.updateClient(id, dto);
    } catch (error) {
      throw new HttpException(
        `Failed to update client: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async deleteClient(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.clientService.deleteClient(id);
    } catch (error) {
      throw new HttpException(
        `Failed to delete client: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
