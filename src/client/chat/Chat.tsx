import * as _ from "lodash";
import * as React from "react";
import { Button } from "react-bootstrap";
import { IMessage, IUsersMap, SocketEvents, TRoomID, TUserID } from "../../common/websocket-declaration";
import { useConditionResolver, useSocketHandler } from "../logic/hooks";
import { INTERNAL_AUTHOR_ID } from "../logic/internal";
import { socket } from "../logic/socket-client";
import "./Chat.css";
import { ChatHistory } from "./ChatHistory";
import { InputPanel } from "./InputPanel";
import { Users } from "./Users";

interface IProps {
    userId: TUserID;
    roomId: TRoomID;
    exit: () => void;
}

export const Chat = ({ userId, roomId, exit }: IProps) => {
    const [users, setUsers] = React.useState<IUsersMap>({});
    const [usersCache, setUsersCache] = React.useState<IUsersMap>({});
    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const sendMessage = (message: string) => {
        socket.send(SocketEvents.ClientMessage, { message }, null);
    };

    useSocketHandler(SocketEvents.Message, msg => {
        setMessages(prevState => [...prevState, msg]);
    });

    useSocketHandler(SocketEvents.Users, usersBody => {
        setUsersCache(p => ({ ...p, ...usersBody.users }));
        setUsers(usersBody.users);
    });

    const usersUpdateAction = useConditionResolver([usersCache]);

    useSocketHandler(SocketEvents.Joined, ({ userId: id, timestamp }) => {
        usersUpdateAction(
            data => _.has(data[0], id),
            data => {
                setMessages(p => [
                    ...p,
                    { authorId: INTERNAL_AUTHOR_ID, message: `${data[0][id].username} joined`, timestamp },
                ]);
            },
        );
    });

    useSocketHandler(SocketEvents.Left, ({ userId: id, timestamp }) => {
        usersUpdateAction(
            data => _.has(data[0], id),
            data => {
                setMessages(p => [
                    ...p,
                    { authorId: INTERNAL_AUTHOR_ID, message: `${data[0][id].username} left`, timestamp },
                ]);
            },
        );
    });

    return (
        <div className="chat">
            <div className="chat__header">
                <div className="chat__room-id">
                    Room ID: <strong>{roomId}</strong>
                </div>
                <Button className="chat__exit" onClick={exit}>
                    Exit
                </Button>
            </div>
            <div className="chat__users">
                <Users userId={userId} users={users} />
            </div>
            <div className="chat__history">
                <ChatHistory messages={messages} users={usersCache} />
            </div>
            <div className="chat__send">
                <InputPanel sendMessage={sendMessage} />
            </div>
        </div>
    );
};
