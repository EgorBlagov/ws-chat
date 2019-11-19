import * as React from "react";
import { Button } from "react-bootstrap";

interface IProps {
    sendMessage: (message: string) => void;
}
export const InputPanel = ({ sendMessage }: IProps) => {
    const [message, setMessage] = React.useState<string>(undefined);
    const ref = React.useRef<HTMLTextAreaElement>();
    const send = () => {
        if (message) {
            sendMessage(message);
            setMessage("");
            ref.current.value = "";
        }
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
        <div className="input-panel">
            <textarea
                onChange={editMessage}
                ref={ref}
                className="input-panel__text"
                onKeyDown={handleEnter}
                value={message}
                maxLength={1024}
            />

            <div className="input-panel__send">
                <Button onClick={send}>Send</Button>
            </div>
        </div>
    );
};
