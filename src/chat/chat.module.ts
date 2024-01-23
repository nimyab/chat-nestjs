import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat]),
        MessageModule,
        UserModule,
    ],
    providers: [ChatService],
    controllers: [ChatController],
    exports: [
        ChatService,
    ]
})
export class ChatModule { }
