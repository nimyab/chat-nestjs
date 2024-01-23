import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';
import { GatewaySessionManager } from './gateway.session';
import { Gateway } from './gateway';

@Module({
    imports:[
        UserModule,
        ChatModule,
        MessageModule,
    ],
    providers:[
        GatewaySessionManager,
        Gateway,
    ]
})
export class GatewayModule {}
