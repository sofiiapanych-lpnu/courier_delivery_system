import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { DeliveryModule } from 'src/modules/delivery/delivery.module';
import { DeliveryService } from 'src/modules/delivery/delivery.service';
import { AddressService } from 'src/modules/address/address.service';
import { AddressModule } from 'src/modules/address/address.module';

@Module({
  imports: [DeliveryModule, AddressModule],
  controllers: [ClientController],
  providers: [ClientService, DeliveryService, AddressService],
  exports: [ClientService],
})
export class ClientModule { }
