
import axios from "axios";
import { useEffect } from "react";
import { Form,Button,Container,Row,Image } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import useModal from "../../useCustom/useModal";
import Modal from "../modal/modal";
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';
import GoogleLogin from "react-google-login";
import route from "../../route";

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

    const googleLoginHandler = (e)=>{
        const profile = e.profileObj;
        if(profile){
            const fd = new FormData();
            fd.append("email",profile.email);
            fd.append("name",profile.name);
            fd.append("socialId",profile.googleId);
            fd.append("image_url",profile.imageUrl);
            fd.append("type","GOOGLE");
            axios.post(route.SOCIAL_LOGIN,fd)
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
        
    }

    const githubLoginHandler = ()=>{
        let gitUrl = "https://github.com/login/oauth/authorize?client_id=55fd921ee403af6b4021&redirect_uri=http://localhost:3000/callback"
        window.open(gitUrl,"new","toolbar=no, menubar=no, scrollbars=yes, resizable=no, width=700, height=700, left=0, top=0");
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
                    <p className="text-center mb-1">
                    <Form.Text >소셜로그인은 <u>24시간 유지</u>가 <font color="#dc3545">불가능</font> 합니다.</Form.Text>
                    </p>
                    <div className="d-flex justify-content-center mt-1">  
                        <GoogleLogin
                            clientId="285365196629-c2qiuplakvpn18dd7svg3d2jmk658v25.apps.googleusercontent.com"
                            render={(r) => (
                                <Button variant="light" onClick={r.onClick} disabled={r.disabled}><FcGoogle size="35"/> Google 로그인</Button>
                            )}
                            onSuccess={googleLoginHandler}
                            // onFailure={}
                            cookiePolicy={'single_host_origin'}
                        />                    
                        &nbsp;   
                        <Button type="button" variant="light" onClick={githubLoginHandler} 
                        style={{backgroundColor : "#171515", color : "#fff", border : "1px solid #2a2a2a"}}>
                            <AiFillGithub size="35"/> Github 로그인
                        </Button>
                        {/* <GitHubLogin className="btn github_btn"  clientId="55fd921ee403af6b4021" 
                        onSuccess={(e)=> console.log(e) }
                        onFailure={(e)=> console.log(e)}
                        disabled={true} >
                          
                        </GitHubLogin> */}
                    </div>
                </Form>
            </Row>     
        </Container>
        </>
    )
}