import { Col, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function Sidebar(){

    const history = useHistory();

    return(
        <Col sm={3} md={2} className="custom-sidebar" style={{minHeight:"100vh"}}>
            <Nav className="flex-column sidebar" variant="pills" defaultActiveKey="/" activeKey={history.location.pathname} >
                <Nav.Item>
                    <Nav.Link href="/" eventKey="/">Calendar</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/routine" eventKey="/routine">Routine</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/workout" eventKey="/workout">Workout</Nav.Link>
                </Nav.Item>  
                <Nav.Item>
                    <Nav.Link href="/share/routine" eventKey="/share/routine">Share</Nav.Link>
                </Nav.Item>      
            </Nav>
        </Col>
    )
}