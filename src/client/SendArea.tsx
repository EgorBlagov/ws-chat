import * as React from "react";
import { Button } from "react-bootstrap";

interface IProps {
    sendMessage: (message: string) => void;
}
export const SendArea = ({ sendMessage }: IProps) => {
    const [message, setMessage] = React.useState<string>(undefined);
    const ref = React.useRef<HTMLTextAreaElement>();
    const send = () => {
        sendMessage(message);
        setMessage("");
        ref.current.value = "";
    };

    const editMessage = (e: any) => {
        setMessage(e.target.value);
    };

    const handleEnter = (e: any) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            send();
        }
    };

    return (
        <div className="send-area__main">
            <textarea
                onChange={editMessage}
                ref={ref}
                className="send-area__text"
                onKeyDown={handleEnter}
                value={message}
            />

            <div className="send-area__send">
                <Button onClick={send}>Send</Button>
            </div>
        </div>
    );
};
