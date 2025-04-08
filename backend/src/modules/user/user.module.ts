import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientService } from './client/client.service';
import { CourierService } from './courier/courier.service';
import { VehicleService } from 'src/modules/vehicle/vehicle.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ClientService, CourierService, VehicleService],
  exports: [UserService],
})
export class UserModule { }
