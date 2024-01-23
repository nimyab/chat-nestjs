import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {

    constructor(
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
        private jwtService: JwtService
    ){}

    generateToken(payload) {
        const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' });
        return { accessToken, refreshToken };
    }
    async findToken(refreshToken) {
        const tokenData = this.tokenRepository.findOne({ where: { refreshToken } });
        return tokenData;
    }
    async saveToken(user, refreshToken) {
        const oldToken = await this.tokenRepository.findOne({
            where: {
                user: user
            }
        });
        if (!!oldToken) {
            await this.tokenRepository.delete({ user: user });
        }
        const newToken = await this.tokenRepository.save({
            user: user,
            refreshToken: refreshToken
        });
    }
    async removeToken(refreshToken) {
        const tokenData = await this.tokenRepository.delete({ refreshToken });
        return tokenData;
    }
    validateAccessToken(token) {
        try {
            const userData = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
            return userData;
        }
        catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
            return userData;
        }
        catch (e) {
            return null;
        }
    }

}
