import { useEffect, useState } from "react";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

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

let Inciencias = function(){
    
    const [alertaSimple, setAlertaSimple] = 
        useState({
                    msm: "",
                    activa: false,
                    icono: 0
                });

    let crearCadenaFecha = (obj) => {
        let ano = (obj.getFullYear())+"";
        let mes = (obj.getMonth()+1)+"";
        let dia = (obj.getDate())+"";

        mes = mes.length <= 1 ? "0"+mes : mes;
        dia = dia.length <= 1 ? "0"+dia : dia;

        return ano+"-"+mes+"-"+dia;
    };

    //ESTILOS
    const barraja = {
        backgroundColor: "#1976d2c6",
        height:"10vh"
    };

    //FILTROS de incidencias
    const [busqueda, setBusqueda] = useState(null);
    const [fechaIni, setFechaIni] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [cantPaginas, setCantPaginas] = useState(1);
    const [paginaActual, setPaginaActual] = useState(1);

    //VARIABLE MENAJO DE MODAL CARGANDO
    const [espera, setEspera] =useState(false);

    //DATOS PDF
    const [pdf, setPdf] = useState([]);

    let ejecutarAjax = async (obj) => {

        setEspera(true);

        try {
            let pet = await ajax.post(urlAjax.VISULIZAR_MEMOS_INC, obj, 
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
            fechaIni: fechaIni, 
            fechaFin: fechaFin, 
            busqueda: busqueda,
            paginacion: valor   };

        await ejecutarAjax(datos);
    };

    let cambiarBusqueda = async (e) => {
        setBusqueda(e.target.value);

        let datos = {    
            fechaIni: fechaIni, 
            fechaFin: fechaFin, 
            busqueda: e.target.value,
            paginacion: paginaActual };

        await ejecutarAjax(datos);
    };

    let cambiarFechaIni = async (e) => {

        setFechaIni(crearCadenaFecha(e["$d"]));

        if( fechaFin == null  )
            return;

        let datos = {    
            fechaIni: crearCadenaFecha(e["$d"]), 
            fechaFin: fechaFin, 
            busqueda: busqueda,
            paginacion: paginaActual };

        await ejecutarAjax(datos);
    };
    
    let cambiarFechaFin = async (e) => {

        setFechaFin(crearCadenaFecha(e["$d"]));

        if( fechaIni == null  )
            return;

        let datos = {    
            fechaIni: fechaIni, 
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

        setTimeout( async () => { await ejecutarAjax(datos) }, 0 );
    }, [] );

    return(

        <Grid container >
            <Grid item xs={3} >
                <Box sx={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}} >
                    <NavarAdmin nav={6} />
                </Box>
            </Grid>
            <Grid item xs={9} >
                <Cargando bool={espera} />
                <AppBar position="static" style={barraja}>
                    <Toolbar>
                        <Box sx={{width:"50%", paddingRight:"1%"}}>
                            <Search value={busqueda} 
                                onChange={ (e) => { cambiarBusqueda(e) } } />
                        </Box>
                        <Box sx={{width:"50%", paddingLeft:"1%", display:"flex"}}>
                            <Box sx={{width:"50%", paddingRight:"1%"}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DemoContainer components={['DatePicker']} >
                                        <DatePicker label="Fecha inicio"
                                            onChange={ (e) => { cambiarFechaIni(e) } }
                                            value={dayjs(fechaIni)}
                                            inputProps={{ readOnly: true }} />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{width:"50%", paddingLeft:"1%"}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker label="Fecha fin"
                                        onChange={ (e) => { cambiarFechaFin(e) } }
                                        value={dayjs(fechaFin)}
                                        />
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
    );
};

export default Inciencias;