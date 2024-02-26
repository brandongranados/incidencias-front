import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardActions from '@mui/material/CardActions';
import CloudUpload from '@mui/icons-material/CloudUpload';


import { Simples } from "./Alertas";
import Logout from "./Logout";
import { MenuList } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { MenuItem } from '@material-ui/core';
import '../css/sidebar.css';






import React, { useState } from "react";

import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Cargando from './Cargando';
import { Alertas } from "./Alertas";
import "../css/datosProfesor.css";

let DatosProfesor = function(){
    
    const [alertaSimple, setAlertaSimple] = 
        useState({
                    msm: "",
                    activa: false,
                    icono: 0
                });
    
    let cambiarMsm = (obj) => {
        setAlertaSimple(obj);
    };

    //CREAR COMPONENTE DE ALERTAS
    const alertasComponent = Alertas();

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

    let solicitarAjax = async (e) => {

        let alertaModal = await alertasComponent.crearModalAlerta({
            titulo: "Advertencia",
            leyenda: "Esta seguro de cargar el documento excel",
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
            cambiarMsm({
                titulo:"Informativo",
                msm: "La operacion fue cancelada",
                activa: true,
                icono: 2
            });
            setTimeout( () => {
                cambiarMsm({
                    titulo:"",
                    msm: "",
                    activa: false,
                    icono: 4
                });
            }, 5000 );
            return;
        }

        setEspera(true);

        if( !( await esperaCargaExcel() ) )
        {
            e.preventDefault();
            setEspera(false);
            cambiarMsm({
                titulo:"Error",
                msm: "No fue posible cargar su excel para ser enviado",
                activa: true,
                icono: 4
            });
            setTimeout( () => {
                cambiarMsm({
                    titulo:"",
                    msm: "",
                    activa: false,
                    icono: 4
                });
            }, 5000 );
            return;
        }

        try {

            let datos = 
            { 
                archivo: archBase64, 
                tipo: tipoArchivo, 
                nombre: nomArch 
            };

            let resp = await ajax.post(urlAjax.EXCEL_PROF, datos, 
                {headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("Authorization")
                    }});

            cambiarMsm({
                titulo:"Ok",
                msm: "Datos de profesores cargados con exito",
                activa: true,
                icono: 1
            });
            
        } catch (error) {
            cambiarMsm({
                titulo:"Error",
                msm: "No fue posible procesar su excel, verifique formato, datos y acomodo de columnas",
                activa: true,
                icono: 4
            });
            setTimeout( () => {
                cambiarMsm({
                    titulo:"",
                    msm: "",
                    activa: false,
                    icono: 4
                });
            }, 5000 );
        }
        setEspera(false);
        setTimeout( () => {
            cambiarMsm({
                titulo:"",
                msm: "",
                activa: false,
                icono: 4
            });
        }, 5000 );
    };

    return(
        <>
            <Grid container >
                <Grid item xs={3} sx={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}} >
                    <MenuList>
                        <MenuItem >
                            <NavLink 
                                className={"sidebar"} 
                                aria-current={"Carga datos de profesor"}
                                to={"/menu-administrador/cargaDatProf"} >
                                    <Typography component="span" variant="h5" textAlign={"right"} >
                                        Carga datos de profesor
                                    </Typography>
                            </NavLink>
                        </MenuItem>
                        <MenuItem >
                            <NavLink
                                className={"link"} 
                                aria-current={"Carga datos de profesor"}
                                to={"/menu-administrador/inciencias"} >
                                    <Typography component="span" variant="h5" textAlign={"right"} >
                                        Inciencias
                                    </Typography>
                            </NavLink>
                        </MenuItem>
                        <MenuItem >
                            <NavLink
                                className={"link"} 
                                aria-current={"Parametros"}
                                to={"/menu-administrador/parametros"} >
                                    <Typography component="span" variant="h5" textAlign={"right"} >
                                        Parametros
                                    </Typography>
                            </NavLink>
                        </MenuItem>
                        <MenuItem >
                            <NavLink
                                className={"link"} 
                                aria-current={"Dias Economicos"}
                                to={"/menu-administrador/incidenciasEconomicos"} >
                                    <Typography component="span" variant="h5" textAlign={"right"} >
                                        Dias Economicos
                                    </Typography>
                            </NavLink>
                        </MenuItem>
                    </MenuList>
                    <Logout/>
                </Grid>
                <Grid item xs={9} >
                    <Simples obj={alertaSimple} />
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
            <Cargando bool={espera} />
        </>
    );
};

export default DatosProfesor;