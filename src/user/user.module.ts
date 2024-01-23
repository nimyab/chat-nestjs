import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { TokenModule } from 'src/token/token.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TokenModule,
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule { }
