import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientModule } from './client/client.module';
import { CourierModule } from './courier/courier.module';
import { VehicleModule } from '../vehicle/vehicle.module';

@Module({
  imports: [ClientModule, CourierModule, VehicleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
