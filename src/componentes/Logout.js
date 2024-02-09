import React from "react";
import { Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sinAcceso } from "./reducerAutenticacion/AutenticacionSlice";

let Logout = function(){

    const despacha = useDispatch();
    const url = useNavigate();

    let cerarSesion = () => {
        despacha(sinAcceso());
        url("/");
    };

    return(
        <div style={{width:"100%", display:"flex", justifyContent:"center"}}>
            <Button sx={{mt:2, width:"50%"}} variant="contained" color="error"
            onClick={cerarSesion} >
                <Typography component={"span"} variant="h5">
                    Salir
                </Typography>
            </Button>
        </div>
    );
};

export default Logout;