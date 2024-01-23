import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request, Response } from 'express';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('/create')
    async createChat(@Req() req: Request, @Res() res: Response) {
        try {
            const { user1, user2 } = req.body;
            const users = [user1, user2];
            const chat = await this.chatService.createChat(users);
            res.status(200).json({
                users: chat.users,
                id: chat.id,
            });
        } catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }

    @Get('/get/:email')
    async getChats(
        @Res() res: Response,
        @Param('email') email: string,
    ) {
        try {
            if (!email) throw new BadRequestException('Invalid email');
            const chats = await this.chatService.getChats(email);
            res.status(200).json({
                chats: chats,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json(error.message);
        }
    }
}
