import { useEffect, useState } from "react";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Simples } from "./Alertas";
import Logout from "./Logout";
import { MenuList } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { MenuItem } from '@material-ui/core';
import '../css/sidebar.css';
import Typography from "@mui/material/Typography";
import dayjs from 'dayjs';
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Pagination from '@mui/material/Pagination';
import Box from "@mui/material/Box";

import DocPdf from "./DocPdf";
import Search from "./Search";
import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Cargando from './Cargando';
import { Alertas } from "./Alertas";

import '../css/incidencias.css';

let IncidenciasEconomico = () => {
    const [alertaSimple, setAlertaSimple] = useState({ msm: "", activa: false, icono: 0 });
    
    let cambiarMsm = (obj) => {
        setAlertaSimple(obj);
    };

    //ESTILOS
    const navar = {
        backgroundColor: "#1976d2c6",
        height:"10vh"
    };
    const estilosFechas = {
        border:"1.5rem solid black"
    };

    //CREAR COMPONENTE DE ALERTAS
    const alertasComponent = Alertas();

    //FILTROS de incidencias
    const [busqueda, setBusqueda] = useState("");
    const [fechaIni, setFechaIni] = useState(dayjs('1970-01-01'));
    const [fechaFin, setFechaFin] = useState(dayjs('1970-01-01'));
    const [paginacion, setPaginacion] = useState(1);

    //VARIABLE MENAJO DE MODAL CARGANDO
    const [espera, setEspera] =useState(false);

    //DATOS PDF
    const [pdf, setPdf] = useState([]);

    let crearCadenaFecha = (obj) => {
        let ano = (obj.getFullYear())+"";
        let mes = (obj.getMonth()+1)+"";
        let dia = (obj.getDate())+"";

        mes = mes.length <= 1 ? "0"+mes : mes;
        dia = dia.length <= 1 ? "0"+dia : dia;

        return ano+"-"+mes+"-"+dia;
    };

    let ejecutarAjax = async (obj) => {

        setEspera(true);

        try {
            let pet = await ajax.post(urlAjax.VISULIZAR_MEMOS_ECO, obj, 
                {headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("Authorization")
                  }});

            let datosResp = await pet.data;
            
            setPdf(datosResp);
            setEspera(false);

        } catch (error) {
            setEspera(false);
        }
    };

    useEffect( () => {
        let datos = {    
            fechaIni: null, 
            fechaFin: null, 
            busqueda: null,
            paginacion: 1   };

        setTimeout(async () => {
            await ejecutarAjax(datos);
        }, 0);
    }, [] );

    return(
        <>
            <Grid container >
                <Grid item xs={3} >
                    <div style={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}}>
                        <MenuList>
                            <MenuItem >
                                <NavLink 
                                    className={"link"}
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
                                    className={"sidebar"} 
                                    aria-current={"Dias Economicos"}
                                    to={"/menu-administrador/incidenciasEconomicos"} >
                                        <Typography component="span" variant="h5" textAlign={"right"} >
                                            Dias Economicos
                                        </Typography>
                                </NavLink>
                            </MenuItem>
                        </MenuList>
                        <Logout/>
                    </div>
                </Grid>
                <Grid item xs={9} >
                    <Simples obj={alertaSimple} />
                    <Grid item xs={12} >
                        <Cargando bool={espera} />
                        <AppBar componenGrt={"nav"} position="static" style={navar}>
                            <Toolbar>
                                <Box sx={{width:"50%", paddingRight:"1%"}}>
                                    <Search/>
                                </Box>
                                <Box sx={{width:"50%", paddingLeft:"1%", display:"flex"}}>
                                    <Box sx={{width:"50%", paddingRight:"1%"}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DemoContainer components={['DatePicker']} >
                                                <DatePicker label="Fecha inicio"/>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Box>
                                    <Box sx={{width:"50%", paddingLeft:"1%"}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DemoContainer components={['DatePicker']}>
                                                <DatePicker label="Fecha fin"
                                                slotProps={{
                                                    TextField:{ estilosFechas }
                                                }} />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                            </Toolbar>
                        </AppBar>
                        <section className="listaDocsPdf">
                            <Grid item xs={12}>
                                <Grid container >
                                    {
                                        pdf.map( (iterador) => (
                                            <DocPdf key={iterador.numero_serie} 
                                                    resp={iterador} />
                                        ) )
                                    }
                                </Grid>
                            </Grid>
                        </section>
                        <section className="paginacion">
                            <Pagination count={10} variant="outlined" shape="rounded" />
                        </section>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default IncidenciasEconomico;