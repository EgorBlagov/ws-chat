import * as _ from "lodash";
import * as React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { IUsers } from "../common/websocket-declaration";

interface IProps {
    users: IUsers;
    userId: string;
}

export const Users = ({ users, userId }: IProps) => (
    <Card className="users">
        <Card.Header as="h5">Users</Card.Header>
        <ListGroup variant="flush" className="users__list">
            {_.map(users.users, (u, id) => (
                <ListGroup.Item key={id} className="p-1" active={id.toString() === userId}>
                    <div>{u.username}</div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    </Card>
);
