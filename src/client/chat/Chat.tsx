import * as _ from "lodash";
import * as React from "react";
import { IMessage, IUsers, SocketEvents, TUserID } from "../../common/websocket-declaration";
import { useConditionResolver, useSocketHandler } from "../logic/hooks";
import { INTERNAL_AUTHOR_ID } from "../logic/internal";
import { socket } from "../logic/socket-client";
import "./Chat.css";
import { ChatHistory } from "./ChatHistory";
import { InputPanel } from "./InputPanel";
import { Users } from "./Users";

interface IProps {
    userId: TUserID;
}

export const Chat = ({ userId }: IProps) => {
    const [users, setUsers] = React.useState<IUsers>({ users: {} });
    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const sendMessage = (message: string) => {
        socket.send(SocketEvents.ClientMessage, { message }, null);
    };

    useSocketHandler(SocketEvents.Message, msg => {
        setMessages(prevState => [...prevState, msg]);
    });

    useSocketHandler(SocketEvents.Users, usersBody => {
        setUsers(usersBody);
    });

    const usersUpdateAction = useConditionResolver([users]);

    useSocketHandler(SocketEvents.Joined, ({ userId: id, timestamp }) => {
        usersUpdateAction(
            data => _.has(data[0].users, id),
            data => {
                setMessages(p => [
                    ...p,
                    { authorId: INTERNAL_AUTHOR_ID, message: `${data[0].users[id].username} joined`, timestamp },
                ]);
            },
        );
    });

    useSocketHandler(SocketEvents.Left, ({ userId: id, timestamp }) => {
        usersUpdateAction(
            data => _.has(data[0].users, id),
            data => {
                setMessages(p => [
                    ...p,
                    { authorId: INTERNAL_AUTHOR_ID, message: `${data[0].users[id].username} left`, timestamp },
                ]);
            },
        );
    });

    return (
        <div className="chat">
            <div className="chat__users">
                <Users userId={userId} users={users} />
            </div>
            <div className="chat__history">
                <ChatHistory messages={messages} users={users} />
            </div>
            <div className="chat__send">
                <InputPanel sendMessage={sendMessage} />
            </div>
        </div>
    );
};