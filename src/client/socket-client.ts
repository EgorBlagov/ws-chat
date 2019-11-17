import * as io from "socket.io-client";
import { getUrl } from "../common/url";
import { safeGet } from "../common/utils";
import {
    SocketEventBody,
    SocketEventCallback,
    SocketEventHandler,
    SocketEvents,
    socketPath,
} from "../common/websocket-declaration";

export interface ISocketClient {
    readonly connected: boolean;
    send<T extends SocketEvents>(socketEvent: T, body: SocketEventBody<T>, ack: SocketEventCallback<T>): void;
    handle<T extends SocketEvents>(socketEvent: T, handler: SocketEventHandler<T>): void;
    removeHandler<T extends SocketEvents>(socketEvent: T, handler: SocketEventHandler<T>): void;
    sendRaw(event: string, body: any, ack?: (x: any) => void): void;
    handleRaw(event: string, handler: (x: any) => void): void;
    removeHandlerRaw(event: string, handler: (x: any) => void): void;
    connect(): void;
}

class SocketIo implements ISocketClient {
    private socket: SocketIOClient.Socket;

    public get connected(): boolean {
        return safeGet(this.socket, s => s.connected, false);
    }

    public sendRaw(event: string, body: any, ack: (x: any) => void): void {
        this.throwIfNotConnected();
        this.socket.emit(event, body, ack);
    }

    public handleRaw(event: string, handler: (x: any) => void): void {
        this.socket.on(event, handler);
    }

    public removeHandlerRaw(event: string, handler: (x: any) => void): void {
        this.socket.off(event, handler);
    }

    public connect(): void {
        this.socket = io.connect("/", {
            path: getUrl(socketPath),
        });
    }

    public send<T extends SocketEvents>(socketEvent: T, body: SocketEventBody<T>, ack?: SocketEventCallback<T>): void {
        this.sendRaw(socketEvent, body, ack);
    }

    public handle<T extends SocketEvents>(socketEvent: T, handler: SocketEventHandler<T>): void {
        this.handleRaw(socketEvent, handler);
    }

    public removeHandler<T extends SocketEvents>(socketEvent: T, handler: SocketEventHandler<T>): void {
        this.removeHandlerRaw(socketEvent, handler);
    }

    private throwIfNotConnected(): void {
        if (!this.connected) {
            throw new Error("Socket is not connected");
        }
    }
}

export const socket: ISocketClient = new SocketIo();
