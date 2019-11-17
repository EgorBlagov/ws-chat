import * as _ from "lodash";
import * as React from "react";
import { Alert, Button, FormControl, InputGroup, Modal } from "react-bootstrap";

interface IProps {
    show: boolean;
    onSaveName: (newName: string) => void;
}

export const EnterNameModal = ({ show, onSaveName }: IProps) => {
    const [name, setName] = React.useState<string>();

    const saveName = () => {
        onSaveName(name);
    };

    const editName = (e: any) => {
        setName(e.target.value);
    };

    // tslint:disable-next-line: no-empty
    const onHide = () => {};

    const isInvalid = !name;

    const formDescription = () => {
        if (!name) {
            return "Name must not be empty";
        }

        return "Ok";
    };

    const handleEnter = (e: any) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            saveName();
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>Who are you?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert className="mb-2" variant={isInvalid ? "light" : "success"}>
                    {formDescription()}
                </Alert>
                <InputGroup>
                    <FormControl
                        placeholder="Please, enter your name"
                        onKeyDown={handleEnter}
                        onChange={editName}
                        isInvalid={isInvalid}
                    />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={saveName} disabled={isInvalid}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
