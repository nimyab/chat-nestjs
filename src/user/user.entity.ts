import { Chat } from 'src/chat/chat.entity';
import { Message } from 'src/message/message.entity';
import { Token } from 'src/token/token.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, ManyToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        nullable: false
    })
    email: string;

    @Column({
        nullable: false
    })
    password: string;

    @Column({
        unique: true,
        nullable: false
    })
    username: string;

    @Column({
        default: false
    })
    idActivated: boolean;

    @OneToOne(() => Token, (token) => token.user)
    token: Token;

    @ManyToMany(() => Chat, (chat) => chat.users)
    chats: Chat[];

    @OneToMany(() => Message, (message) => message.from)
    messages: Message[];
}
