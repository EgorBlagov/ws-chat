import * as crypto from "crypto";
import { TRoomID, TUserID } from "../common/websocket-declaration";
import { logger } from "./logging";

const ROOM_CREATE_TRIALS: number = 10;

export class RoomManager {
    private rooms: Map<TRoomID, Set<TUserID>>;
    constructor() {
        this.rooms = new Map<TRoomID, Set<TUserID>>();
    }

    public createRoom(): TRoomID {
        for (let i = 0; i < ROOM_CREATE_TRIALS; i++) {
            const roomId = crypto.randomBytes(3).toString("hex");
            if (!this.rooms.has(roomId)) {
                logger.info(`Room created ${roomId}`);
                this.rooms.set(roomId, new Set<TUserID>());
                return roomId;
            }
        }

        throw new Error("Unable to generate unique room id");
    }

    public isExist(roomId: TRoomID): boolean {
        return this.rooms.has(roomId);
    }

    public join(userId: TUserID, roomId: TRoomID) {
        if (!this.isExist(roomId)) {
            throw new Error(`Room ${roomId} doesn't exist`);
        }

        if (this.rooms.get(roomId).has(userId)) {
            throw new Error(`User ${userId} already joined ${roomId}`);
        }

        this.rooms.get(roomId).add(userId);
        logger.info(`User ${userId} joined ${roomId}`);
    }

    public leave(userId: TUserID, roomId: TRoomID) {
        if (!this.isExist(roomId)) {
            throw new Error(`Room ${roomId} doesn't exist`);
        }

        if (!this.rooms.get(roomId).has(userId)) {
            throw new Error(`User ${userId} is not joined to ${roomId}`);
        }

        this.rooms.get(roomId).delete(userId);
        logger.info(`User ${userId} left ${roomId}`);
        if (this.rooms.get(roomId).size === 0) {
            this.rooms.delete(roomId);
            logger.info(`Room deleted ${roomId}`);
        }
    }

    public getUsers(roomId: TRoomID): TUserID[] {
        const result: TUserID[] = [];

        if (!this.isExist(roomId)) {
            return result;
        }

        this.rooms.get(roomId).forEach(x => result.push(x));
        return result;
    }
}
