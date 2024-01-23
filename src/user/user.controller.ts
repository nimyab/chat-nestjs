import {
    Controller,
    Get,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('current')
    async getCurrentUser(@Req() req: Request, @Res() res: Response) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) throw new UnauthorizedException();
            const user = await this.userService.findUserByToken(refreshToken);
            res.status(200).json({
                email: user.email,
                id: user.id,
                username: user.username,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                error: 'refresh token error'
            });
        }
    }

    @Get('users')
    async getUsers(@Req() req: Request, @Res() res: Response) {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json({
                users: users,
            });
        } catch (error) {
            res.status(400).json(error);
        }
    }
}
