import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserDtoForToken } from 'src/dtos/user.dto.token';
import { UserDto } from 'src/dtos/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
    ) {}

    async createUser(dto: UserDto) {
        const candidate = await this.userService.findUser(dto.email);
        if (candidate) {
            throw new BadRequestException('user already exists');
        } else {
            const hashPassword = await bcrypt.hash(dto.password, 3);
            await this.userService.createUser({
                ...dto,
                password: hashPassword,
            });
        }
    }
    async loginUser(dto: UserDto) {
        const user = await this.userService.findUser(dto.email);
        if (!user) {
            throw new BadRequestException('there is no such user');
        }
        const passwordsAreEqual = await bcrypt.compare(
            dto.password,
            user.password,
        );
        if (!passwordsAreEqual) {
            throw new BadRequestException('password is wrong');
        } else {
            const userPayload = {
                id: user.id,
                email: user.email,
            } as UserDtoForToken;
            const tokens = this.tokenService.generateToken({ ...userPayload });
            await this.tokenService.saveToken(user, tokens.refreshToken);
            return { ...user, ...tokens };
        }
    }
    async logoutUser(refreshToken: string) {
        const token = await this.tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        const userData = this.tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await this.tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw new UnauthorizedException();
        } else {
            const user = await this.userService.findUser(userData.email);
            const userDto = {
                id: user.id,
                email: user.email,
            } as UserDtoForToken;
            const tokens = this.tokenService.generateToken({ ...userDto });
            await this.tokenService.saveToken(user, tokens.refreshToken);
            return { ...user, ...tokens };
        }
    }
}
