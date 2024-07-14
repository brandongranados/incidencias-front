import { useEffect, useState } from "react";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
import NavarAdmin from './NavarAdmin';

import '../css/incidencias.css';

let IncidenciasEconomico = () => {
    const [alertaSimple, setAlertaSimple] = useState({ msm: "", activa: false, icono: 0 });
    
    /*let cambiarMsm = (obj) => {
        setAlertaSimple(obj);
    };*/

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
    const [busqueda, setBusqueda] = useState(null);
    const [fecha, setFecha] = useState(null);
    const [cantPaginas, setCantPaginas] = useState(1);
    const [paginaActual, setPaginaActual] = useState(1);

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

            if( datosResp.cant > 10 )
            {
                let temp = parseInt(datosResp.cant)%10 > 0 ? parseInt(parseInt(datosResp.cant)/10) + 1 : parseInt(datosResp.cant)/10;
                setCantPaginas(temp);
                setPaginaActual(obj.paginacion);
            }
            else
            {
                setCantPaginas(1);
                setPaginaActual(1);
            }
            
            setPdf(datosResp.lista);
            setEspera(false);

        } catch (error) {
            setEspera(false);
        }
    };

    let cambiaPaginacion = async (e, valor) => {

        if( valor == paginaActual )
            return;

        setPaginaActual(valor);

        let datos = {    
            fechaIni: fecha,
            fechaFin: fecha,
            busqueda: busqueda,
            paginacion: valor   };

        await ejecutarAjax(datos);
    };

    let cambiarBusqueda = async (e) => {
        setBusqueda(e.target.value);

        let datos = {    
            fechaIni: fecha,
            fechaFin: fecha,
            busqueda: e.target.value,
            paginacion: paginaActual };

        await ejecutarAjax(datos);
    };
    let cambiarFecha = async (e) => {

        setFecha(crearCadenaFecha(e["$d"]));

        let datos = {    
            fechaIni: crearCadenaFecha(e["$d"]),
            fechaFin: crearCadenaFecha(e["$d"]), 
            busqueda: busqueda,
            paginacion: paginaActual };

        await ejecutarAjax(datos);
    };

    useEffect( () => {
        let datos = {    
            fechaIni: null,
            fechaFin: null,
            busqueda: null,
            paginacion: 1   };

        setTimeout(async () => { await ejecutarAjax(datos); }, 0);
    }, [] );

    return(
        <Grid container >
            <Grid item xs={3} >
                <Box sx={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}}>
                    <NavarAdmin sx={{backgroundColor:"rgba(0, 0, 0, 0.85)"}} nav={7} />
                </Box>
            </Grid>
            <Grid item xs={9} >
                <Grid item xs={12} >
                    <Cargando bool={espera} />
                    <AppBar componenGrt={"nav"} position="static" style={navar}>
                        <Toolbar>
                            <Box sx={{width:"70%", paddingRight:"1%"}}>
                                <Search value={busqueda} 
                                onChange={ (e) => { cambiarBusqueda(e) } }/>
                            </Box>
                            <Box sx={{width:"30%", paddingLeft:"1%", display:"flex"}}>
                                <Box sx={{width:"100%", paddingRight:"1%"}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DemoContainer components={['DatePicker']} >
                                            <DatePicker label="Fecha economico"
                                            onChange={ (e) => { cambiarFecha(e) } }
                                            value={dayjs(fecha)}
                                            inputProps={{ readOnly: true }} />
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
                    <Box display={"flex"} 
                    justifyContent={"center"}
                    backgroundColor={"#0000001a"}>
                        <Pagination 
                        count={cantPaginas}
                        page={paginaActual}
                        onChange={ cambiaPaginacion }
                        variant="outlined" 
                        shape="rounded"/>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default IncidenciasEconomico;