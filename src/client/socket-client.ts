import * as io from "socket.io-client";
import { getUrl } from "../common/url";
import { safeGet } from "../common/utils";
import { SocketEventBody, SocketEventHandler, SocketEvents, socketPath } from "../common/websocket-declaration";

export interface ISocketClient {
    send<T extends SocketEvents>(socketEvent: T, body: SocketEventBody<T>): void;
    handle<T extends SocketEvents>(socketEvent: T, handler: SocketEventHandler<T>): void;
    removeHandler<T extends SocketEvents>(socketEvent: T, handler: SocketEventHandler<T>): void;
    onConnect(handler: () => void): void;
    connect(): void;
}

class SocketIo implements ISocketClient {
    private socket: SocketIOClient.Socket;
    public connect(): void {
        this.socket = io.connect("/", {
            path: getUrl(socketPath),
        });
    }

    public send<T extends SocketEvents>(socketEvent: T, body: SocketEventBody<T>): void {
        this.throwIfNotConnected();
        this.socket.emit(socketEvent, body);
    }

    public handle<T extends SocketEvents>(socketEvent: T, handler: SocketEventHandler<T>): void {
        this.socket.on(socketEvent, handler);
    }

    public removeHandler<T extends SocketEvents>(socketEvent: T, handler: SocketEventHandler<T>): void {
        this.socket.off(socketEvent, handler);
    }

    public onConnect(handler: () => void): void {
        if (this.connected) {
            handler();
        } else {
            this.socket.on("connect", handler);
        }
    }
    private get connected(): boolean {
        return safeGet(this.socket, s => s.connected, false);
    }

    private throwIfNotConnected(): void {
        if (!this.connected) {
            throw new Error("Socket is not connected");
        }
    }
}

export const socket: ISocketClient = new SocketIo();
