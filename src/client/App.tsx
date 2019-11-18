import * as _ from "lodash";
import * as React from "react";
import { Spinner } from "react-bootstrap";
import { isOk } from "../common/utils";
import { IMessage, IUsers, SocketEvents } from "../common/websocket-declaration";
import { EnterNameModal } from "./EnterNameModal";
import { socket } from "./logic/socket-client";

import "./App.css";
import { useConditionResolver, useSocketConnected, useSocketHandler } from "./logic/hooks";
import { INTERNAL_AUTHOR_ID } from "./logic/internal";
import { Messages } from "./Messages";
import { SendArea } from "./SendArea";
import { StatusIcon } from "./StatusIcon";
import { Users } from "./Users";

export const App = () => {
    const [username, setUsername] = React.useState<string>(undefined);
    const [userId, setUserId] = React.useState<string>(undefined);
    const [users, setUsers] = React.useState<IUsers>({ users: {} });
    const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
    const [messages, setMessages] = React.useState<IMessage[]>([]);

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

    const connected = useSocketConnected({
        onConnect: () => {
            if (isOk(username)) {
                socket.send(SocketEvents.Username, { username }, id => setUserId(id));
            }
        },
    });

    React.useEffect(() => {
        if (!isInitialized && connected) {
            setIsInitialized(true);
        }
    }, [connected]);

    const saveName = (newName: string) => {
        socket.send(
            SocketEvents.Username,
            {
                username: newName,
            },
            id => {
                setUserId(id);
            },
        );

        setUsername(newName);
    };

    const sendMessage = (message: string) => {
        socket.send(SocketEvents.ClientMessage, { message }, null);
    };

    return (
        <>
            <StatusIcon active={connected} />
            <div className="wrapper">
                <div className="main">
                    <div className="main__body">
                        {!isInitialized ? (
                            <Spinner className="text-success main__center-spinner" animation="border" />
                        ) : (
                            <>
                                <div className="main__users">
                                    <Users userId={userId} users={users} />
                                </div>
                                <div className="main__messages">
                                    <Messages messages={messages} users={users} />
                                </div>
                                <div className="main__send">
                                    <SendArea sendMessage={sendMessage} />
                                </div>
                                <EnterNameModal show={!isOk(username)} onSaveName={saveName} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
