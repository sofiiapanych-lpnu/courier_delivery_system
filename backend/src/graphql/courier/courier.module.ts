import { Module } from '@nestjs/common';
import { CourierResolver } from './courier.resolver';
import { CourierService } from './courier.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CourierResolver, CourierService],
})
export class CourierModule_ { }
