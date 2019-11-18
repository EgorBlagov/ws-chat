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
            setLoginError(undefined);
            setIsInitialized(false);
        },
    });

    React.useEffect(() => {
        if (!isInitialized && connected) {
            setIsInitialized(true);
        }
    }, [connected]);

    const login = (username: TUserID, loginRoomId?: TRoomID) => {
        socket.send(
            SocketEvents.Login,
            {
                username,
                roomId: loginRoomId,
            },
            (receivedUserId, receivedRoomId, receivedError) => {
                if (isOk(receivedError)) {
                    setLoginError(receivedError);
                } else {
                    setUserId(receivedUserId);
                    setRoomId(receivedRoomId);
                }
            },
        );
    };

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
