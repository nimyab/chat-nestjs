import { Message } from 'src/message/message.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Message, (message) => message.chat, { onDelete: 'CASCADE' })
    messages: Message[]

    @ManyToMany(() => User, (user) => user.chats)
    @JoinTable()
    users: User[];
}
