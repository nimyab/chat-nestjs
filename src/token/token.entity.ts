import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    refreshToken: string;

    @OneToOne(() => User, (user) => user.token)
    @JoinColumn()
    user: User;

}
