import * as io from "socket.io-client";
import { safeGet } from "../common/utils";

export interface ISocket {
    connect(): void;
    emit(event: string, data: any): void;
    on(event: string, callback: (data: any) => void): void;
}

class SocketIo implements ISocket {
    private socket: SocketIOClient.Socket;

    public connect(): void {
        this.socket = io.connect("/", {
            path: "/socket",
        });
    }

    public emit(event: string, data: any): void {
        this.throwIfNotConnected();
        this.socket.emit(event, data);
    }

    public on(event: string, callback: (data: any) => void): void {
        this.throwIfNotConnected();
        this.socket.on(event, callback);
    }

    private throwIfNotConnected(): void {
        if (!safeGet(this.socket, s => s.connected, false)) {
            throw new Error("Socket is not connected");
        }
    }
}

export const socket: ISocket = new SocketIo();
