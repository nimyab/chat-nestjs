import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { MessageService } from 'src/message/message.service';
import { ChatDto } from 'src/dtos/chat.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
        private userService: UserService,
        private messageService: MessageService,
    ) {}

    async createChat(users: string[]) {
        const user1 = await this.userService.findUser(users[0]);
        const user2 = await this.userService.findUser(users[1]);
        const usersArr = [user1, user2];
        const chat = await this.chatRepository.save({
            users: usersArr,
            messages: [],
        });
        return chat;
    }

    async addMessage(dto: ChatDto) {
        const message = await this.messageService.createMessage(dto.message);
        return message;
    }

    async getChats(email: string) {
        const user = await this.userService.findUser(email);
        const chatsId = await this.chatRepository.find({
            where: {
                users: user,
            },
        });
        const chats = await Promise.all(
            chatsId.map((chatId) =>
                this.chatRepository.find({
                    where: {
                        id: chatId.id,
                    },
                    relations: {
                        messages: {
                            from: true,
                        },
                        users: true
                    },
                }),
            ),
        );
        return chats;
    }

    async findChatById(id: number) {
        const chat = await this.chatRepository.findOne({
            where: { id },
            relations: {
                messages: true,
                users: true,
            },
        });
        return chat;
    }
}
