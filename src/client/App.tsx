import "./App.css";

import * as React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Container, ListGroup } from "react-bootstrap";

export const App = () => {
    return (
        <div className="wrapper">
            <div className="main">
                <div className="main__body">
                    <Container>
                        <Row>
                            <Col xs={5}>
                                <ListGroup>
                                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                    <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                                    <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col xs={7}>
                                <ListGroup>
                                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                    <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                                    <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                </ListGroup>
                                <Button variant="info">Hey</Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </div>
    );
};
