import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModel } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { AddressModule } from './modules/address/address.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { OrderModule } from './modules/order/order.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { CourierScheduleModule } from './modules/courier-schedule/courier-schedule.module';
import { CourierWeeklyScheduleModule } from './modules/courier-weekly-schedule/courier-weekly-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModel,
    UserModule,
    PrismaModule,
    VehicleModule,
    AddressModule,
    WarehouseModule,
    OrderModule,
    DeliveryModule,
    FeedbackModule,
    CourierScheduleModule,
    CourierWeeklyScheduleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
