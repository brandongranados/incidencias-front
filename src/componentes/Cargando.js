import { useEffect, useState } from "react";

import Modal from "@mui/material/Modal";
import CircularProgress from '@mui/material/CircularProgress';

let Cargando = ({bool}) => {
    const [abierto, setAbierto] = useState(false);
    const [iconoTam, setIconoTam] = useState(0);

    useEffect( () => {
        bool ? setAbierto(true) : setAbierto(false);
    }, [bool] );

    useEffect( () => {
        if( window.innerWidth < 768 )
            setIconoTam(50);
        else if( window.innerWidth >= 768 && window.innerWidth < 1080 )
            setIconoTam(120);
        else
            setIconoTam(200);
    }, [] );

    return(
        <Modal
        open={abierto}
        aria-labelledby="Título cargando"
        aria-describedby="cargando" >
            <div style={{height:"100vh", width:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                <CircularProgress size={iconoTam}/>
            </div>
        </Modal>
    )
};

export default Cargando;