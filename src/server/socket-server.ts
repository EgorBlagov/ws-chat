// tslint:disable max-classes-per-file
import * as _ from "lodash";
import * as io from "socket.io";

import { Server } from "http";
import { isOk, toMsg } from "../common/utils";
import {
    IMessage,
    IUser,
    IUsers,
    SocketEventBody,
    SocketEventHandler,
    SocketEvents,
    socketPath,
    TRoomID,
    TUserID,
    IUsersMap,
} from "../common/websocket-declaration";
import { logger } from "./logging";
import { RoomManager } from "./room-manager";

export interface ISocketServer {
    connect(server: Server): void;
}

interface IUserInfo {
    username: string;
    roomId: TRoomID;
}

class SocketServer implements ISocketServer {
    private io: io.Server;
    private userInfos: Map<TUserID, IUserInfo>;
    private roomManager: RoomManager;

    public connect(server: Server): void {
        this.userInfos = new Map<TUserID, IUserInfo>();
        this.roomManager = new RoomManager();

        this.io = io(server, {
            path: socketPath,
        });

        this.io.sockets.on("connection", socket => {
            this.onConnected(socket);
        });
    }

    private onConnected(socket: io.Socket): void {
        logger.info("+total: " + _.size(this.io.sockets.sockets));
        socket.on("disconnect", () => {
            logger.info("-total: " + _.size(this.io.sockets.sockets));
            if (this.userInfos.has(socket.id)) {
                const roomId = this.userInfos.get(socket.id).roomId;

                if (this.roomManager.isExist(roomId)) {
                    this.roomManager.leave(socket.id, this.userInfos.get(socket.id).roomId);
                }

                // Room can be removed after last user leave
                if (this.roomManager.isExist(roomId)) {
                    this.sendEvent(this.io.to(roomId), SocketEvents.Left, {
                        timestamp: Date.now(),
                        userId: socket.id,
                    });
                    this.sendEvent(this.io.to(roomId), SocketEvents.Users, this.getUsers(roomId));
                }
                this.userInfos.delete(socket.id);
            }
        });

        this.handleEvent(socket, SocketEvents.Login, ({ username, roomId }, ack) => {
            let userRoomID = roomId;
            try {
                if (!isOk(roomId)) {
                    userRoomID = this.roomManager.createRoom();
                }

                this.roomManager.join(socket.id, userRoomID);
                socket.join(userRoomID);

                this.userInfos.set(socket.id, {
                    roomId: userRoomID,
                    username,
                });
                ack(socket.id, userRoomID);
                this.sendEvent(this.io.to(userRoomID), SocketEvents.Users, this.getUsers(userRoomID));
                this.sendEvent(this.io.to(userRoomID), SocketEvents.Joined, {
                    timestamp: Date.now(),
                    userId: socket.id,
                });
            } catch (error) {
                ack(undefined, undefined, toMsg(error));
            }
        });

        this.handleEvent(socket, SocketEvents.ClientMessage, (body, _1) => {
            const message: IMessage = {
                authorId: socket.id,
                message: body.message,
                timestamp: Date.now(),
            };

            if (this.userInfos.has(socket.id)) {
                const roomId = this.userInfos.get(socket.id).roomId;
                if (this.roomManager.isExist(roomId)) {
                    this.sendEvent(this.io.to(roomId), SocketEvents.Message, message);
                }
            }
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

    private getUsers(roomId: TRoomID): IUsers {
        return {
            users: _.reduce(
                this.roomManager.getUsers(roomId),
                (result: IUsersMap, userId: TUserID) => {
                    result[userId] = {
                        username: this.userInfos.get(userId).username,
                    };
                    return result;
                },
                {},
            ),
        };
    }
}

export const socketServer: ISocketServer = new SocketServer();
