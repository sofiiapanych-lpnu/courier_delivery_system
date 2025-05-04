import { Module } from '@nestjs/common';
import { WarehouseResolver } from './warehouse.resolver';
import { WarehouseService } from './warehouse.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WarehouseResolver, WarehouseService],
})
export class WarehouseModule_ { }
