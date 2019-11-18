import Color = require("color");
import * as _ from "lodash";
import * as React from "react";
import { Card, ListGroup } from "react-bootstrap";
import sha1 = require("sha1");
import { isOk, safeGet } from "../../common/utils";
import { IMessage, IUsersMap } from "../../common/websocket-declaration";
import { INTERNAL_AUTHOR_ID } from "../logic/internal";

interface IProps {
    users: IUsersMap;
    messages: IMessage[];
}

export const ChatHistory = ({ users, messages }: IProps) => {
    const ref = React.useRef<HTMLDivElement>();
    React.useEffect(() => {
        if (isOk(ref.current)) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <Card className="history">
            <Card.Header as="h5">Chat</Card.Header>
            <ListGroup variant="flush" className="history__body">
                {_.map(messages, (m, i) => {
                    const msgColor = Color(`#${sha1(m.authorId).slice(0, 6)}`);
                    const authorStyle: React.CSSProperties = {
                        color: msgColor.darken(0.2).hex(),
                    };
                    let authorName = safeGet(users, x => x[m.authorId].username);
                    if (m.authorId === INTERNAL_AUTHOR_ID) {
                        authorName = "Chat";
                        authorStyle.backgroundColor = "bg-primary";
                    }

                    return (
                        <ListGroup.Item key={i} className="p-0">
                            <div className="d-flex align-items-center p-1 rounded-sm">
                                <div className="mr-1 align-self-start font-weight-bold" style={authorStyle}>
                                    {authorName}
                                </div>
                                <div>{m.message}</div>
                                <div className="history__date text-muted ml-auto align-self-start">
                                    {new Date(m.timestamp).toLocaleString("ru-RU", {
                                        hour: "numeric",
                                        minute: "numeric",
                                        second: "numeric",
                                    })}
                                </div>
                            </div>
                        </ListGroup.Item>
                    );
                })}
                <div ref={ref} />
            </ListGroup>
        </Card>
    );
};
