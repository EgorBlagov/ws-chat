// tslint:disable: max-classes-per-file

export const socketPath: string = "/socket";

export enum SocketEvents {
    Users = "Users",
    Username = "Username",
    Joined = "Joined",
    History = "History",
    Message = "Message",
    Left = "Left",
}

export enum SocketDefinitionTypes {
    Body,
}

export interface IUsersBody {
    users: string[];
}

export interface IUsernameBody {
    username: string;
}

export interface ISocketDefinitionTypeMap {
    [SocketEvents.Users]: {
        [SocketDefinitionTypes.Body]: IUsersBody;
    };
    [SocketEvents.Username]: {
        [SocketDefinitionTypes.Body]: IUsernameBody;
    };
    [SocketEvents.Joined]: {
        [SocketDefinitionTypes.Body]: {};
    };
    [SocketEvents.History]: {
        [SocketDefinitionTypes.Body]: {};
    };
    [SocketEvents.Message]: {
        [SocketDefinitionTypes.Body]: {};
    };
    [SocketEvents.Left]: {
        [SocketDefinitionTypes.Body]: {};
    };
}

export type SocketEventBody<T extends SocketEvents> = ISocketDefinitionTypeMap[T][SocketDefinitionTypes.Body];
export type SocketEventHandler<T extends SocketEvents> = (body: SocketEventBody<T>) => void;
