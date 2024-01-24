import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GatewayModule } from './gateway/gateway.module';
import { MessageModule } from './message/message.module';
import { TokenModule } from './token/token.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { Chat } from './chat/chat.entity';
import { User } from './user/user.entity';
import { Message } from './message/message.entity';
import { Token } from './token/token.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.HOST_BD,
            port: Number(process.env.PORT_BD),
            username: process.env.USERNAME_BD,
            password: process.env.PASSWORD_BD,
            database: process.env.DATABASE,
            entities: [Chat, User, Message, Token],
            autoLoadEntities: Boolean(process.env.AUTOLOADENTITIES),
            synchronize: Boolean(process.env.SYNCHRONIZE),
        }),
        UserModule,
        AuthModule,
        ChatModule,
        GatewayModule,
        MessageModule,
        TokenModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UserController);
    }
}
