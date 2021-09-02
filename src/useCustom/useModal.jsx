import { useState } from "react";

const init = {
    modal : 0,
    data : {}
}
export default function useModal(){

    // modal open  0 ? close : ~
    const [modal, setModal] = useState(init);

    const close = ()=> {
        setModal(init);
        document.body.style.overflowY = "auto";
    } ;

    const eventModal = ()=> modal.modal !== 0 ? document.body.style.overflowY = "hidden" : document.body.style.overflowY = "auto";

    return {
        modal, 
        setModal, 
        eventModal,
        close
    }
}

