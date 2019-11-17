// tslint:disable max-classes-per-file
import * as _ from "lodash";
import * as io from "socket.io";

import { Server } from "http";
import { isOk, safeGet } from "../common/utils";
import {
    IMessage,
    IUsers,
    SocketEventBody,
    SocketEventHandler,
    SocketEvents,
    socketPath,
    TUserID,
} from "../common/websocket-declaration";
import { logger } from "./logging";

export interface ISocketServer {
    connect(server: Server): void;
}

class SocketServer implements ISocketServer {
    private io: io.Server;
    private usersCache: Record<TUserID, string>;

    public connect(server: Server): void {
        this.usersCache = {};
        this.io = io(server, {
            path: socketPath,
        });

        this.io.sockets.on("connection", socket => {
            this.onConnected(socket);
        });
    }

    private onConnected(socket: io.Socket): void {
        this.sendEvent(socket, SocketEvents.Users, this.getUsers());

        logger.info("new connection, total: " + _.size(this.io.sockets.sockets));
        socket.on("disconnect", () => {
            logger.info("lost connection, total: " + _.size(this.io.sockets.sockets));
            if (isOk(this.usersCache[socket.id])) {
                this.sendEvent(this.io.sockets, SocketEvents.Left, {
                    timestamp: Date.now(),
                    userId: socket.id,
                });
            }

            delete this.usersCache[socket.id];
            this.sendEvent(this.io.sockets, SocketEvents.Users, this.getUsers());
        });

        this.handleEvent(socket, SocketEvents.Username, (body, ack) => {
            this.usersCache[socket.id] = body.username;
            ack(socket.id);

            this.sendEvent(this.io.sockets, SocketEvents.Users, this.getUsers());
            this.sendEvent(this.io.sockets, SocketEvents.Joined, {
                timestamp: Date.now(),
                userId: socket.id,
            });
        });

        this.handleEvent(socket, SocketEvents.ClientMessage, (body, _1) => {
            const message: IMessage = {
                authorId: socket.id,
                message: body.message,
                timestamp: Date.now(),
            };

            this.sendEvent(this.io.sockets, SocketEvents.Message, message);
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

    private getUsers(): IUsers {
        return {
            users: _(this.usersCache)
                .mapValues(name => ({
                    username: name,
                }))
                .pickBy(user => safeGet(user, x => isOk(x.username), false))
                .value(),
        };
    }
}

export const socketServer: ISocketServer = new SocketServer();
