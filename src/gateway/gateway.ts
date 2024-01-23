import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';
import { GatewaySessionManager } from './gateway.session';
import { MessageDto } from 'src/dtos/message.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuardGateWay } from './gateway.guard';

@WebSocketGateway({
    cors: { origin: 'http://localhost:3000', credentials: true },
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private userService: UserService,
        private chatService: ChatService,
        private messageService: MessageService,
        private sessions: GatewaySessionManager,
    ) {}

    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(client.id, 'connect');
        this.sessions.setUserSocket(client.handshake.auth.id, client);
    }

    handleDisconnect(client: Socket) {
        console.log(client.id, 'disconnect');
        this.sessions.removeUserSocket(client.handshake.auth.id);
    }

    @UseGuards(AuthGuardGateWay)
    @SubscribeMessage('newMessage')
    async newMessage(client: Socket, payload: any) {
        const { userId, chatId, content } = payload;
        const from = await this.userService.findUserById(userId);
        const chat = await this.chatService.findChatById(chatId);

        if (!from || !chat || !content) {
            throw new WsException('Invalid data');
        }
        if (chat.users.findIndex((user) => user.id === from.id) === -1) {
            throw new WsException('This chat does not exist');
        }

        const message = {
            from: from,
            content: content,
            chat: chat,
        } as MessageDto;

        const newMessage = await this.messageService.createMessage(message);
        chat.users.map((user) => {
            const userSession = this.sessions.getUserSocket(user.id);
            if (userSession) {
                userSession.emit('newMessage', {
                    message: newMessage,
                });
            }
        });
    }

    @UseGuards(AuthGuardGateWay)
    @SubscribeMessage('createChat')
    async createChat(client: Socket, payload: any) {
        const { users } = payload;
        if (!users) {
            throw new WsException('Invalid data');
        }
        const chat = await this.chatService.createChat(users);
        const secondUser = await this.userService.findUser(users[0]);
        if (secondUser) {
            const secondUserSession = this.sessions.getUserSocket(
                secondUser.id,
            );
            if (secondUserSession) {
                secondUserSession.emit('createChat', { chat });
            }
            client.emit('createChat', { chat });
        } else {
        }
        console.log(chat, 'createChat');
    }
}
