import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private tokenService: TokenService,
    ) {}

    async createUser(userDto) {
        const user = await this.userRepository.save({
            email: userDto.email,
            password: userDto.password,
            username: userDto.username,
        });
        return user;
    }
    async findUser(email: string) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        return user;
    }
    async getAllUsers() {
        const users = await this.userRepository.find();
        return users;
    }
    async findUserByToken(token) {
        const refToken = await this.tokenService.findToken(token);
        const user = await this.userRepository.findOne({
            where: {
                token: refToken,
            },
        });
        return user;
    }
    async findUserById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        return user;
    }
}
