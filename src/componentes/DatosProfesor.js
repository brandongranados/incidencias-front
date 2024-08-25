import React, { useState } from "react";

import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardActions from '@mui/material/CardActions';
import CloudUpload from '@mui/icons-material/CloudUpload';

import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Cargando from './Cargando';
import { Alertas } from "./Alertas";
import NavarAdmin from './NavarAdmin';

import "../css/datosProfesor.css";
import '../css/sidebar.css';

let DatosProfesor = function(){

    //CREAR COMPONENTE DE ALERTAS
    const alertasComponent = Alertas();

    //CARGA DE ARCHIVOS
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
              resolve({ archBase64: cadenaArray[1], tipoArchivo: tipo[1], nombre: archivo.name, bool: true });
            };
            leer.onerror = (e) => {
              reject({ bool: false });
            };
            leer.readAsDataURL(archivo);
          });
    };

    let cambiarRuta = async (e) => setArchSel(e.target.files[0]);

    let solicitarAjax = async (e) => {

        let alertaModal = await alertasComponent.crearModalAlerta({
            titulo: "Advertencia.",
            leyenda: "¿Está seguro de cargar el documento Excel?",
            icono: 5,
            activaCancelacion: true,
            TextoConfirmacion: "Cargar",
            textoCancelacion: "Cancelar",
            colorCancelar: "#d32f2f",
            activa: true,
            colorConfirmar: "#2e7d32"
        });

        if( !alertaModal )
        {
            e.preventDefault();
            await alertasComponent.crearModalAlerta({
                titulo: "Informativo.",
                leyenda: "La operación fue cancelada.",
                icono: 4,
                activaCancelacion: false,
                TextoConfirmacion: "Ok",
                textoCancelacion: "Cancelar",
                colorCancelar: "#d32f2f",
                activa: true,
                colorConfirmar: "#2e7d32"
            });
            return;
        }

        setEspera(true);

        let excel = await leerArchivo(archSel);

        if( !excel.bool )
        {
            e.preventDefault();
            setEspera(false);
            await alertasComponent.crearModalAlerta({
                titulo: "Error",
                leyenda: "No fue posible cargar su Excel para ser enviado.",
                icono: 4,
                activaCancelacion: false,
                TextoConfirmacion: "Ok",
                textoCancelacion: "",
                colorCancelar: "",
                activa: true,
                colorConfirmar: "#d32f2f"
            });
            return;
        }

        try {

            let datos = 
            { 
                archivo: excel.archBase64, 
                tipo: excel.tipoArchivo, 
                nombre: excel.nombre 
            };

            await ajax.post(urlAjax.EXCEL_PROF, datos);

            await alertasComponent.crearModalAlerta({
                titulo: "Ok",
                leyenda: "Datos de profesores cargados con éxito.",
                icono: 1,
                activaCancelacion: false,
                TextoConfirmacion: "Ok",
                textoCancelacion: "",
                colorCancelar: "",
                activa: true,
                colorConfirmar: "#2e7d32"
            });
        } catch (error) {
            await alertasComponent.crearModalAlerta({
                titulo: "Error",
                leyenda: "No fue posible procesar su Excel, verifiqué formato, datos y acomodo de columnas.",
                icono: 2,
                activaCancelacion: false,
                TextoConfirmacion: "Ok",
                textoCancelacion: "",
                colorCancelar: "",
                activa: true,
                colorConfirmar: "#d32f2f"
            });
        }
        setEspera(false);
    };

    return(
        <Grid container >
            <Grid item xs={3} sx={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}} >
                <NavarAdmin nav={1} />
            </Grid>
            <Grid item xs={9} >
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
                            <Button variant="contained" 
                                color="success"
                                onClick={solicitarAjax} >
                                Registrar profesores desde excel
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DatosProfesor;