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
import { CourierModule } from './modules/user/courier/courier.module';
import { ClientModule } from './modules/user/client/client.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DeliveryModule_ } from './graphql/delivery/delivery.module';
import { WarehouseModule_ } from './graphql/warehouse/warehouse.module'
import { AddressModule_ } from './graphql/address/address.module';
import { OrderModule_ } from './graphql/order/order.module';
import { ClientModule_ } from './graphql/client/client.module';
import { CourierModule_ } from './graphql/courier/courier.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModel,
    UserModule,
    CourierModule,
    ClientModule,
    PrismaModule,
    VehicleModule,
    AddressModule,
    WarehouseModule,
    OrderModule,
    DeliveryModule,
    FeedbackModule,
    CourierScheduleModule,
    CourierWeeklyScheduleModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    DeliveryModule_,
    WarehouseModule_,
    AddressModule_,
    OrderModule_,
    ClientModule_,
    CourierModule_,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
