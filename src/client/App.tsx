import * as React from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
export const App = () => {
    return <div style={{
        width: '80%',
        height: '80vh',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '80px',
    }}>
        <Card style={{
            height: '100%'
        }}>
            <Card.Body style={{display: 'flex', flexDirection:'column'}}>
                <Card.Title>Websocket chat</Card.Title>
                    <div style={{ display: 'flex'}}>
                        <ListGroup>
                            <ListGroup.Item>Cras justo odio</ListGroup.Item>
                            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                        </ListGroup>
                    </div>
                    <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
  </div>
}
