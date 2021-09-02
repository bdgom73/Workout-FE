
import axios from "axios";
import { useEffect } from "react";
import { Form,Button,Container,Row,Image } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import useModal from "../../useCustom/useModal";
import Modal from "../modal/modal";

export default function Login(){

    const [cookies,setCookies] = useCookies();
    const history = useHistory();
    const { modal, 
        setModal, 
        eventModal,
        close
    } = useModal();

    useEffect(()=> eventModal,[modal]);

    const modalHandler = ()=>{
        if(modal.modal === 1){
            return <Modal isMessage close={close} messageType={modal.data.state ? "success" : "error"}>
                {modal.data.message}
            </Modal>
        }
    }

    const loginSubmitHandler = (e)=>{
        e.preventDefault();  
        const fd = new FormData();
        fd.append("email",e.target[0].value);
        fd.append("password",e.target[1].value);
        axios.post(`/myApi/member/login?keep=${e.target[2].checked}`,fd)
        .then(res=>{
            const result = res.data;
            if(result.result_state){
               window.localStorage.setItem("SSID", result.data);           
                window.location.reload();
            }else{
                setModal({
                    modal : 1,
                    data : {
                        message : result.message,
                        state : result.result_state
                    }
                });
            }
        }).catch((e)=>{
            setModal({
                modal : 1,
                data : {
                    message : e.response.data.message ? e.response.data.message : "로그인에 실패했습니다.",
                    state : false
                }
            });
        })
    }

    return(
        <>
        {modalHandler()}
        <Container style={{backgroundColor:"#212429", minHeight: "100vh", maxWidth:"100%"}}>
            <Row md="auto" lg="3" style={{justifyContent:"center"}} >
                <Form style={{color : "#fff", marginTop:"50px",minHeight:"300px"}} onSubmit={loginSubmitHandler}>
                    <Row style={{justifyContent:"center"}}>
                        <Image src="/images/noimage.png" className="logo" roundedCircle ></Image>
                    </Row>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="24시간 유지"/>
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" size="lg">
                            Login
                        </Button>
                    </div>
                    <div style={{textAlign:"center", marginTop:"5px"}}>
                        <Form.Text >
                            회원이 아니신가요 ? <Form.Text style={{color : "#fff"}}><Link to="/join">회원가입</Link></Form.Text>
                        </Form.Text>
                    </div>
                </Form>
            </Row>     
        </Container>
        </>
    )
}