import * as _ from "lodash";
import * as React from "react";
import { Spinner } from "react-bootstrap";
import { isOk } from "../common/utils";
import { SocketEvents, TRoomID, TUserID } from "../common/websocket-declaration";

import { socket } from "./logic/socket-client";

import "./App.css";
import { useSocketConnected } from "./logic/hooks";
import { StatusIcon } from "./StatusIcon";
import { Welcome } from "./welcome/Welcome";

export const App = () => {
    const [username, setUsername] = React.useState<string>(undefined);
    const [userId, setUserId] = React.useState<TUserID>(undefined);
    const [roomId, setRoomId] = React.useState<TRoomID>(undefined);

    const [isInitialized, setIsInitialized] = React.useState<boolean>(false);

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
            id => setUserId(id),
        );

        setUsername(newName);
    };

    return (
        <>
            <div className="wrapper">
                <div className="app">
                    <div className="app__status-icon">
                        <StatusIcon active={connected} />
                    </div>
                    {!isInitialized ? (
                        <Spinner className="app__spinner text-success" animation="border" />
                    ) : (
                        <div className="app__welcome">
                            <Welcome saveName={saveName} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
