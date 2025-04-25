import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { DeliveryModule } from 'src/modules/delivery/delivery.module';
import { DeliveryService } from 'src/modules/delivery/delivery.service';
import { AddressService } from 'src/modules/address/address.service';
import { AddressModule } from 'src/modules/address/address.module';
import { FeedbackModule } from 'src/modules/feedback/feedback.module';
import { FeedbackService } from 'src/modules/feedback/feedback.service';

@Module({
  imports: [DeliveryModule, AddressModule, FeedbackModule],
  controllers: [ClientController],
  providers: [ClientService, DeliveryService, AddressService, FeedbackService],
  exports: [ClientService],
})
export class ClientModule { }
