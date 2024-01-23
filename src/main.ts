import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const PORT = 5000;
    app.use(cookieParser())
    app.enableCors({
        credentials: true,
        origin: process.env.CLIENT_URL
    });
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(PORT, () => console.log(`server was started on ${PORT} port`));
}
bootstrap();
