import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //тільки ті поля що є в дто
    transform: true, //Без цієї опції NestJS не застосовує @Type(() => Class)
  }));
  app.enableCors({
    origin: 'http://localhost:5173', // дозволяємо запити з React'а
    credentials: true, // якщо використовуєш куки або авторизацію
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
