import * as classnames from "classnames";
import * as React from "react";
import { Alert, Button, Card, FormControl } from "react-bootstrap";
import { TUserID } from "../../common/websocket-declaration";
import "./Welcome.css";

interface IProps {
    login: (name: TUserID, roomId?: TUserID) => void;
    error: string;
}

export const Welcome = ({ login, error }: IProps) => {
    const [name, setName] = React.useState<string>(undefined);
    const [roomId, setRoomId] = React.useState<string>(undefined);
    const editName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const editRoomId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomId(e.target.value);
    };

    const nameValid = !!name;
    const roomIdValid = !!roomId;

    const getLoginHandler = (newRoom: boolean) => () => {
        login(name, newRoom ? undefined : roomId);
    };

    return (
        <div className="welcome">
            <div className="welcome__caption display-4">
                <strong>Simple</strong> chat
            </div>
            <Card className="welcome__body">
                <FormControl className="welcome__name-input" placeholder="Name" onChange={editName} />
                <div className="welcome__room-wrapper">
                    <Button disabled={!nameValid} block={true} onClick={getLoginHandler(true)}>
                        Create new room
                    </Button>
                    <div className="room-or">
                        <hr />
                        <div className="room-or__text">or</div>
                    </div>
                    <div className="welcome__room-join">
                        <FormControl placeholder="Room ID" onChange={editRoomId} />
                        <Button
                            disabled={!roomIdValid || !nameValid}
                            className="welcome__room-join-button"
                            onClick={getLoginHandler(false)}
                        >
                            Join
                        </Button>
                    </div>
                    <Alert
                        variant="danger"
                        className={classnames("welcome__alert", { "welcome__alert--hidden": !error })}
                    >
                        {error}
                    </Alert>
                </div>
            </Card>
        </div>
    );
};
