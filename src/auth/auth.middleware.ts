import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private tokenService: TokenService) { }

    use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization.split(' ')[1]) {
            throw new UnauthorizedException();
        }
        const flag = this.tokenService.validateAccessToken(req.headers.authorization.split(' ')[1]);
        if (!flag) {
            throw new UnauthorizedException();
        }
        next();
    }
}
