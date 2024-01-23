import { Injectable } from "@nestjs/common";
import { Socket } from 'socket.io';

@Injectable()
export class GatewaySessionManager {
    private sessions: Map<number, Socket> = new Map();

    getUserSocket(id: number) {
        return this.sessions.get(id);
    }
    setUserSocket(id: number, user: Socket) {
        this.sessions.set(id, user);
    }
    removeUserSocket(id: number) {
        this.sessions.delete(id);
    }
    getSockets() {
        return this.sessions;
    }
}