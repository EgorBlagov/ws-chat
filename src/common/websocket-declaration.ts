// tslint:disable: max-classes-per-file

export const socketPath: string = "/socket";

export enum SocketEvents {
    Users = "Users",
    Joined = "Joined",
    Message = "Message",
    ClientMessage = "ClientMessage",
    Left = "Left",
    Login = "Login",
    Exit = "Exit",
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
export interface IUsersMap extends Record<TUserID, IUser> {}

export interface IUsers {
    users: IUsersMap;
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

export interface ILoginInfo {
    username: string;
    roomId?: string;
}

export interface ISocketDefinitionTypeMap {
    [SocketEvents.Users]: {
        [SocketDefinitionTypes.Body]: IUsers;
        [SocketDefinitionTypes.Callback]: null;
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
    [SocketEvents.Login]: {
        [SocketDefinitionTypes.Body]: ILoginInfo;
        [SocketDefinitionTypes.Callback]: (userId: TUserID, roomId: TRoomID, error?: string) => void;
    };
    [SocketEvents.Exit]: {
        [SocketDefinitionTypes.Body]: {};
        [SocketDefinitionTypes.Callback]: null;
    };
}

export type SocketEventBody<T extends SocketEvents> = ISocketDefinitionTypeMap[T][SocketDefinitionTypes.Body];
export type SocketEventCallback<T extends SocketEvents> = ISocketDefinitionTypeMap[T][SocketDefinitionTypes.Callback];
export type SocketEventHandler<T extends SocketEvents> = (
    body: SocketEventBody<T>,
    ack?: SocketEventCallback<T>,
) => void;
