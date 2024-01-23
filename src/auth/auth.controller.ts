import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { UserDto } from 'src/dtos/user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/registration')
    async createUser(@Body() userDto: UserDto, @Res() res: Response) {
        try {
            await this.authService.createUser(userDto);
            return res.status(200).json('Success');
        }
        catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }

    @Post('/login')
    async login(@Body() userDto: UserDto, @Res() res: Response) {
        try {
            const userData = await this.authService.loginUser(userDto);
            res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 });
            return res.status(200).json({
                id: userData.id,
                email: userData.email,
                username: userData.username,
                accessToken: userData.accessToken,
            });
        }
        catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }

    @Post('/logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            const { refreshToken } = req.cookies;
            await this.authService.logoutUser(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json('logout');
        }
        catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }

    @Get('/refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await this.authService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 });
            return res.status(200).json({
                id: userData.id,
                email: userData.email,
                username: userData.username,
                accessToken: userData.accessToken,
            });
        }
        catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }
}
