import { Chat } from 'src/chat/chat.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, ManyToMany, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.messages)
    from: User;

    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: Chat;

    @Column({
        nullable: false,
    })
    content: string;

    @CreateDateColumn()
    createAt: Date;
}
