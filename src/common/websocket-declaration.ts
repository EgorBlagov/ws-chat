// tslint:disable: max-classes-per-file

export const socketPath: string = "/socket";

export enum SocketEvents {
    Users = "Users",
    Username = "Username",
    Joined = "Joined",
    Message = "Message",
    ClientMessage = "ClientMessage",
    Left = "Left",
    CreateRoom = "CreateRoom",
    JoinRoom = "JoinRoom",
}

export enum SocketDefinitionTypes {
    Body,
    Callback,
}

export type TUserID = string;
export type TRoomID = string;

export interface IUser {
    username: string;
}

export interface IUsers {
    users: Record<TUserID, IUser>;
}

export interface IUsername {
    username: string;
}

export interface IMessage {
    authorId: TUserID;
    message: string;
    timestamp: number;
}

export interface IClientMessage {
    message: string;
}

export interface IUserEvent {
    userId: TUserID;
    timestamp: number;
}

export interface ISocketDefinitionTypeMap {
    [SocketEvents.Users]: {
        [SocketDefinitionTypes.Body]: IUsers;
        [SocketDefinitionTypes.Callback]: null;
    };
    [SocketEvents.Username]: {
        [SocketDefinitionTypes.Body]: IUsername;
        [SocketDefinitionTypes.Callback]: (id: TUserID) => void;
    };
    [SocketEvents.Joined]: {
        [SocketDefinitionTypes.Body]: IUserEvent;
        [SocketDefinitionTypes.Callback]: null;
    };
    [SocketEvents.Message]: {
        [SocketDefinitionTypes.Body]: IMessage;
        [SocketDefinitionTypes.Callback]: null;
    };
    [SocketEvents.Left]: {
        [SocketDefinitionTypes.Body]: IUserEvent;
        [SocketDefinitionTypes.Callback]: null;
    };
    [SocketEvents.ClientMessage]: {
        [SocketDefinitionTypes.Body]: IClientMessage;
        [SocketDefinitionTypes.Callback]: null;
    };
    [SocketEvents.CreateRoom]: {
        [SocketDefinitionTypes.Body]: never;
        [SocketDefinitionTypes.Callback]: null;
    };
    [SocketEvents.JoinRoom]: {
        [SocketDefinitionTypes.Body]: never;
        [SocketDefinitionTypes.Callback]: null;
    };
}

export type SocketEventBody<T extends SocketEvents> = ISocketDefinitionTypeMap[T][SocketDefinitionTypes.Body];
export type SocketEventCallback<T extends SocketEvents> = ISocketDefinitionTypeMap[T][SocketDefinitionTypes.Callback];
export type SocketEventHandler<T extends SocketEvents> = (
    body: SocketEventBody<T>,
    ack?: SocketEventCallback<T>,
) => void;
