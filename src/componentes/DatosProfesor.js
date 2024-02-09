import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardActions from '@mui/material/CardActions';
import CloudUpload from '@mui/icons-material/CloudUpload';

import axios from "axios";
import React, { useState } from "react";

import Cargando from './Cargando';
import "../css/datosProfesor.css";

let DatosProfesor = function(){

    //CARGA DE ARCHIVOS
    const [archBase64, setArchBase64] = useState("");
    const [tipoArchivo, setTipoArchivo] = useState("");
    const [nomArch, setNomArch] = useState("");
    const [archSel, setArchSel] = useState();

    //VARIABLE MENAJO DE MODAL CARGANDO
    const [espera, setEspera] =useState(false);

    let leerArchivo = function(archivo){
        return new Promise((resolve, reject) => {
            let leer = new FileReader();
            leer.onload = (e) => {
              let resultado = leer.result;
              let cadenaArray = resultado.split(",");
              let type = archivo.name;
              let tipo = type.split(".");
              resolve({ archBase64: cadenaArray[1], tipoArchivo: tipo[1], nombre: archivo.name });
            };
            leer.onerror = (e) => {
              reject(new Error("Error al leer el archivo"));
            };
            leer.readAsDataURL(archivo);
          });
    };

    let cambiarRuta = async (e) => {
        setArchSel(e.target.files[0]);
    };

    let esperaCargaExcel = async () => {

        let retorno = false;

        if( archSel )
            try {
                let { archBase64, tipoArchivo, nombre } = await leerArchivo(archSel);
                setArchBase64(archBase64);
                setTipoArchivo(tipoArchivo);
                setNomArch(nombre);
                retorno = true;
            } catch (error){
                retorno = false;
            }
        
        return retorno;
    };

    let ajax = async (e) => {

        setEspera(true);

        if( !( await esperaCargaExcel() ) )
        {
            e.preventDefault();
            setEspera(false);
            return;
        }

        try {
            let obj = { archivo: archBase64, tipo: tipoArchivo, 
                nombre: nomArch };
        } catch (error) {
            
        }
        
    };

    return(
        <>
            <Cargando bool={espera} />
            <Grid item xs={12} >
                <Card className='cardFondos' >
                    <CardContent className='masivaFlex' >
                        <Typography variant="h3" component={"span"} >
                            Registrar nuevo profesor
                        </Typography>
                    </CardContent>
                    <CardActions className='masivaFlex' >
                        <Button variant="contained" startIcon={<CloudUpload />}
                            onClick={ () => { document.getElementById('cargarExcel').click() } } >
                            Cargar Excel
                            <input id='cargarExcel' 
                            type='file' 
                            accept=".xlsx" 
                            style={{display:"none"}}
                            onChange={cambiarRuta} />
                        </Button>
                        <Button variant="contained" color="success" >
                            Registrar profesores desde excel

                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </>
    );
};

export default DatosProfesor;