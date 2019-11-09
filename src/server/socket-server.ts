// tslint:disable max-classes-per-file
import * as _ from "lodash";
import * as io from "socket.io";

import { Server } from "http";
import { isOk } from "../common/utils";
import { SocketEventBody, SocketEventHandler, SocketEvents, socketPath } from "../common/websocket-declaration";
import { logger } from "./logging";

declare global {
    namespace SocketIO {
        // tslint:disable-next-line: interface-name
        interface Socket {
            username: string;
        }
    }
}

export interface ISocketServer {
    connect(server: Server): void;
}

class SocketServer implements ISocketServer {
    private io: io.Server;
    public connect(server: Server): void {
        this.io = io(server, {
            path: socketPath,
        });

        this.io.sockets.on("connection", socket => {
            this.onConnected(socket);
        });
    }

    private onConnected(socket: io.Socket): void {
        this.sendEvent(this.io.sockets, SocketEvents.Users, {
            users: this.getUsernames(),
        });

        logger.info("new connection, total: " + _.size(this.io.sockets.sockets));
        socket.on("disconnect", () => {
            logger.info("lost connection, total: " + _.size(this.io.sockets.sockets));
            this.sendEvent(this.io.sockets, SocketEvents.Users, {
                users: this.getUsernames(),
            });
        });

        this.handleEvent(socket, SocketEvents.Username, body => {
            socket.username = body.username;
            this.sendEvent(this.io.sockets, SocketEvents.Users, {
                users: this.getUsernames(),
            });
        });
    }

    private sendEvent<T extends SocketEvents>(
        socket: io.Socket | io.Namespace,
        socketEvent: T,
        body: SocketEventBody<T>,
    ): void {
        logger.debug(`emit ${socketEvent}`, body);
        socket.emit(socketEvent, body);
    }

    private handleEvent<T extends SocketEvents>(
        socket: io.Socket,
        socketEvent: T,
        handler: SocketEventHandler<T>,
    ): void {
        socket.on(socketEvent, data => {
            logger.debug(`received ${socketEvent}`, data);
        });
        socket.on(socketEvent, handler);
    }

    private getUsernames(): string[] {
        return _(this.io.sockets.sockets)
            .map(x => x.username)
            .filter(x => isOk(x))
            .value();
    }
}

export const socketServer: ISocketServer = new SocketServer();
