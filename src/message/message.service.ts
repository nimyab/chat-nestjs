import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { MessageDto } from 'src/dtos/message.dto';

@Injectable()
export class MessageService {

    constructor(
        @InjectRepository(Message) private messageRepository: Repository<Message>
    ) { }

    async createMessage(dto: MessageDto) {
        const message = await this.messageRepository.save({
            chat: dto.chat,
            content: dto.content,
            from: dto.from,
        });
        return message;
    }

}
