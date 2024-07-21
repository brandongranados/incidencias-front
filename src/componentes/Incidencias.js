import { useEffect, useState } from "react";

import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Pagination from '@mui/material/Pagination';
import Box from "@mui/material/Box";

import DocPdf from "./DocPdf";
import Search from "./Search";
import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Cargando from './Cargando';
import NavarAdmin from './NavarAdmin';
import { TextField } from "@mui/material";

let Inciencias = function(){
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
            let pet = await ajax.post(urlAjax.VISULIZAR_MEMOS_INC, obj);

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
        let ini = new Date(e.target.value).getTime();
        let fin = new Date(fechaFin).getTime();

        if( e.target.value.length == 0 )
            setFechaIni(null);
        else
            setFechaIni(e.target.value);

        if( fechaFin == null || ini > fin )
            return;

        let datos = {    
            fechaIni: e.target.value, 
            fechaFin: fechaFin, 
            busqueda: busqueda,
            paginacion: paginaActual };

        await ejecutarAjax(datos);
    };
    
    let cambiarFechaFin = async (e) => {
        let ini = new Date(fechaIni).getTime();
        let fin = new Date(e.target.value).getTime();

        if( e.target.value.length == 0 )
            setFechaFin(null);
        else
            setFechaFin(e.target.value);

        if( fechaIni == null || ini > fin )
            return;

        let datos = {    
            fechaIni: fechaIni, 
            fechaFin: e.target.value, 
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
                    <Grid container>
                        <Grid item xs={6}>
                            <Box sx={{pr: 1}}>
                                <Search value={busqueda}
                                onChange={ (e) => { cambiarBusqueda(e) } } />
                            </Box>
                        </Grid>
                        <Grid item xs={6} container>
                            <Grid item xs={6}>
                                <Box sx={{pr:1}}>
                                    <TextField
                                    sx={{marginTop:"6px", width: 1}}
                                    type="date"
                                    placeholder="Fecha inicio"
                                    onChange={ (e) => { cambiarFechaIni(e) } }
                                    value={fechaIni}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{pr:1}}>
                                    <TextField
                                    sx={{marginTop:"6px", width: 1}}
                                    type="date"
                                    placeholder="Fecha fin"
                                    onChange={ (e) => { cambiarFechaFin(e) } }
                                    value={fechaFin}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
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