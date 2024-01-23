import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class AuthGuardGateWay implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isAuth = context.getArgs()[0].handshake.auth.id;
        return isAuth;
    }
}