import { IsNotEmpty } from "class-validator";
import { Chat } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";

export class MessageDto {
    @IsNotEmpty()
    from: User;

    @IsNotEmpty()
    content: string;
    
    @IsNotEmpty()
    chat: Chat;
}