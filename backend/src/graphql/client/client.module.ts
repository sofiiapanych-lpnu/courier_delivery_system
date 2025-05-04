import { Module } from '@nestjs/common';
import { ClientResolver } from './client.resolver';
import { ClientService } from './client.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ClientResolver, ClientService],
})
export class ClientModule_ { }
