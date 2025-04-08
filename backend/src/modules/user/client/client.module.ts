import { Module } from '@nestjs/common';
import { ClientService } from './client.service';

@Module({
  controllers: [],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule { }
