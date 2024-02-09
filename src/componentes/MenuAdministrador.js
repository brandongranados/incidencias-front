import React, { useState } from "react";

import Grid from '@mui/material/Grid';

import '../css/sidebar.css';
import DatosProfesor from "./DatosProfesor";
import Inciencias from "./Incidencias";
import { NavLink, Route, Routes } from "react-router-dom";
import Logout from "./Logout";
import { MenuList } from "@material-ui/core";
import { MenuItem, Typography } from "@mui/material";

let MenuAdministrador = function({pag}){

    const[menDesp, setMenDesp]  = useState( [ 
                        {i:1, nom:"Carga datos de profesor", estado:true, 
                            pag:"cargaDatProf", exac: false },
                        {i:2, nom:"Inciencias", estado:false, 
                            pag:"inciencias", exac: true},
                        {i:3, nom:"Parametros", estado:false, 
                            pag:"parametros", exac: false } ] );

    let cambiarPagina = function(objBuscado){
        for(let f = 0; f < menDesp.length; f++)
            menDesp[f].estado = false;
        
        let menDespIzq = menDesp.filter( (itera) => itera.i < objBuscado.i );
        let menDespDer = menDesp.filter( (itera) => itera.i > objBuscado.i );
        objBuscado.estado = true;

        setMenDesp([ ...menDespIzq, objBuscado, ...menDespDer ]);
    };

    return(
        <Grid container >
            <Grid item xs={3} sx={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}} >
                <MenuList>
                    {
                        menDesp.map( (iterador) => (
                            <MenuItem
                            key={iterador.i} >
                                <NavLink onClick={function(){ cambiarPagina(iterador) }} 
                                    className={iterador.estado ? "sidebar" : "link" } 
                                    aria-current={iterador.nom}
                                    to={"/menu-administrador/"+iterador.pag}>
                                        <Typography component="span" variant="h5" >
                                            {iterador.nom}
                                        </Typography>
                                </NavLink>
                            </MenuItem>
                        ) )
                    }   
                </MenuList>
                <Logout/>
            </Grid>
            <Grid item xs={9} >
                { pag === 1 && <DatosProfesor /> }
                { pag === 2 && <Inciencias/> }
            </Grid>
        </Grid>
    );
};

export default MenuAdministrador;