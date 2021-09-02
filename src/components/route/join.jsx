
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Form,Button,Container,Row,Image, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import useModal from "../../useCustom/useModal";
import Modal from "../modal/modal";

export default function Join(){

    const history = useHistory();

    const { modal, 
            setModal, 
            eventModal,
            close
        } = useModal();


    const modalHandler = ()=>{
        if(modal.modal === 1){
            return <Modal isMessage close={close} messageType={modal.data.state ? "success" : "error"}>
                {modal.data.message}
            </Modal>
        }
    }

    useEffect(()=> eventModal,[modal]);

    const formSubmitHandler = (e)=>{
        console.log(e.target[4].value);
        e.preventDefault();  
        const formdata = {
            email : e.target[0].value,
            password1 : e.target[1].value,
            password2 : e.target[2].value,
            name : e.target[3].value,
            nickname : e.target[4].value,
        }
        axios.post("/myApi/member/signup",formdata)
        .then(res=>{
            const result = res.data;
            if(result.result_state){
                history.push("/");
            }else{
                setModal({
                    modal : 1,
                    data : {
                        message : result.message,
                        state : result.result_state
                    }
                })
            }
        }).catch(e=>{
            setModal({
                modal : 1,
                data : {
                    message : "알수 없는 오류로 실패했습니다.",
                    state : false
                }
            })
        })
    }

    return(
        <>
        {modalHandler()}
        <Container style={{backgroundColor:"#212429", minHeight: "100vh", maxWidth:"100%"}}>
            <Row md="auto" lg="3" style={{justifyContent:"center"}} >
                <Form style={{color : "#fff", marginTop:"50px",minHeight:"300px"}} onSubmit={formSubmitHandler}>
                    <Row style={{justifyContent:"center"}}>
                        <Image src="/images/noimage.png" className="logo" roundedCircle ></Image>
                    </Row>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" className="mb-1"/>
                        <Form.Label >Same Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Row>
                        <Form.Group as={Col} className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" />          
                        </Form.Group>
                        <Form.Group  as={Col} className="mb-3" controlId="formBasicNickname">
                        <Form.Label>Nickname</Form.Label>
                            <Form.Control type="text" placeholder="Nickname" />
                        </Form.Group>
                    </Row>  
                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" size="lg">
                            Sign Up
                        </Button>
                    </div>
                    <div style={{textAlign:"center", marginTop:"5px"}}>
                        <Form.Text >
                            이미 회원 이신가요 ? <Form.Text style={{color : "#fff"}}><Link to="/">로그인</Link></Form.Text>
                        </Form.Text>
                    </div>
                </Form>
            </Row>        
        </Container>
        </>
    )
}