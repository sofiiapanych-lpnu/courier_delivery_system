import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const role = '';

    super({ //викликає конструктор батьківського класу
      datasources: {
        db: {
          url: config.get(`DATABASE_URL`),
        },
      },
    });
  }
}
