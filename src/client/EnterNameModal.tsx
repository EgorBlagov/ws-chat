import * as _ from "lodash";
import * as React from "react";
import { Alert, Button, FormControl, InputGroup, Modal } from "react-bootstrap";

interface IProps {
    show: boolean;
    onSaveName: (newName: string) => void;
    usedNames: string[];
}

export const EnterNameModal = ({ show, onSaveName, usedNames }: IProps) => {
    const [name, setName] = React.useState<string>();

    const saveName = () => {
        onSaveName(name);
    };

    const editName = (e: any) => {
        setName(e.target.value);
    };

    // tslint:disable-next-line: no-empty
    const onHide = () => {};

    const isNameTaken = (n: string): boolean => {
        return _(usedNames)
            .map(x => x.toLowerCase())
            .includes(n.toLowerCase());
    };

    const isInvalid = !name || isNameTaken(name);
    const formDescription = () => {
        if (!name) {
            return "Name must not be empty";
        }

        if (isNameTaken(name)) {
            return "Name already taken";
        }

        return "Ok";
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
                        id="name-input"
                        placeholder="Please, enter your name"
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
