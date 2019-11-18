import * as _ from "lodash";
import * as React from "react";
import { Spinner } from "react-bootstrap";
import { isOk } from "../common/utils";
import { SocketEvents, TRoomID, TUserID } from "../common/websocket-declaration";

import { socket } from "./logic/socket-client";

import "./App.css";
import { Chat } from "./chat/Chat";
import { useSocketConnected } from "./logic/hooks";
import { StatusIcon } from "./StatusIcon";
import { Welcome } from "./welcome/Welcome";

export const App = () => {
    const [userId, setUserId] = React.useState<TUserID>(undefined);
    const [roomId, setRoomId] = React.useState<TRoomID>(undefined);
    const [loginError, setLoginError] = React.useState<string>(undefined);

    const [isInitialized, setIsInitialized] = React.useState<boolean>(false);

    const connected = useSocketConnected({
        onDisconnect: () => {
            setUserId(undefined);
            setRoomId(undefined);
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
    };

    const login = (_username: TUserID, _roomId?: TRoomID) => {};

    let content = <Spinner className="app__spinner text-success" animation="border" />;
    if (isInitialized) {
        if (isOk(userId) && isOk(roomId)) {
            content = <Chat userId={userId} roomId={roomId} />;
        } else {
            content = (
                <div className="app__welcome">
                    <Welcome login={login} error={loginError} />
                </div>
            );
        }
    }

    return (
        <>
            <div className="wrapper">
                <div className="app">
                    <div className="app__status-icon">
                        <StatusIcon active={connected} />
                    </div>
                    {content}
                </div>
            </div>
        </>
    );
};
