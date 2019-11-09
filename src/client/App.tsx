import * as _ from "lodash";
import * as React from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { isOk } from "../common/utils";
import { SocketEventHandler, SocketEvents } from "../common/websocket-declaration";
import { EnterNameModal } from "./EnterNameModal";
import { socket } from "./socket-client";

import "./App.css";

function useSocketHandler<T extends SocketEvents>(socketEvent: T, handler: SocketEventHandler<T>) {
    React.useEffect(() => {
        socket.handle(socketEvent, handler);
        return () => {
            socket.removeHandler(socketEvent, handler);
        };
    }, []);
}

export const App = () => {
    const [name, setName] = React.useState<string>(undefined);
    const [users, setUsers] = React.useState<string[]>([]);
    useSocketHandler(SocketEvents.Users, usersBody => {
        setUsers(usersBody.users);
    });

    const saveName = (newName: string) => {
        socket.send(SocketEvents.Username, {
            username: newName,
        });
        setName(newName);
    };

    return (
        <div className="wrapper">
            <div className="main">
                <div className="main__body">
                    <Container fluid={true}>
                        <Row>
                            <Col xs={2}>
                                <ListGroup variant="flush">
                                    {_.map(users, u => (
                                        <ListGroup.Item key={u} className="p-1">
                                            <div className="d-flex justify-content-center">{u}</div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Col>
                        </Row>
                    </Container>
                    <EnterNameModal show={!isOk(name)} onSaveName={saveName} usedNames={users} />
                </div>
            </div>
        </div>
    );
};
