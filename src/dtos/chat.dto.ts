import { User } from "src/user/user.entity";
import { MessageDto } from "./message.dto";

export  class ChatDto {
    users: User[];
    id?: number;
    message?: MessageDto;
}