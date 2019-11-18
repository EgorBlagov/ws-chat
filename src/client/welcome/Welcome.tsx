import * as React from "react";
import { Button, Card, FormControl } from "react-bootstrap";
import "./Welcome.css";

interface IProps {
    saveName: (newName: string) => void;
}

export const Welcome = ({  }: IProps) => {
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

    return (
        <div className="welcome">
            <div className="welcome__caption display-4">
                <strong>Simple</strong> chat
            </div>
            <Card className="welcome__body">
                <FormControl className="welcome__name-input" placeholder="Name" value={name} onChange={editName} />
                <div className="welcome__room-wrapper">
                    <Button disabled={!nameValid} block={true}>
                        Create new room
                    </Button>
                    <div className="room-or">
                        <hr />
                        <div className="room-or__text">or</div>
                    </div>
                    <div className="welcome__room-join">
                        <FormControl placeholder="Room ID" onChange={editRoomId} />
                        <Button disabled={!roomIdValid || !nameValid} className="welcome__room-join-button">
                            Join
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
