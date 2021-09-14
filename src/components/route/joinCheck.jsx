import { Container, Spinner } from "react-bootstrap";

export default function JoinCheck(){

    return(
        <>
        <Container style={{backgroundColor:"#212429", minHeight: "100vh", maxWidth:"100%"}} className="d-flex justify-content-center align-items-center">
            <h1 style={{color : "#fff"}}>Workout App 불러오는중 ... <Spinner animation="grow"/></h1>
        </Container>
        </>
    );
}