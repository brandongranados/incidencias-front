import { useEffect, useState } from "react";

import '../css/sidebar.css';
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Pagination from '@mui/material/Pagination';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import DocPdf from "./DocPdf";
import Search from "./Search";
import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Cargando from './Cargando';
import NavarAdmin from './NavarAdmin';

import '../css/incidencias.css';

let IncidenciasEconomico = () => {

    //ESTILOS
    const navar = {
        backgroundColor: "#1976d2c6",
        height:"10vh"
    };

    //FILTROS de incidencias
    const [busqueda, setBusqueda] = useState(null);
    const [fecha, setFecha] = useState(null);
    const [cantPaginas, setCantPaginas] = useState(1);
    const [paginaActual, setPaginaActual] = useState(1);

    //VARIABLE MENAJO DE MODAL CARGANDO
    const [espera, setEspera] =useState(false);

    //DATOS PDF
    const [pdf, setPdf] = useState([]);

    let ejecutarAjax = async (obj) => {

        setEspera(true);

        try {
            let pet = await ajax.post(urlAjax.VISULIZAR_MEMOS_ECO, obj);

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

        setFecha(e.target.value.length == 0 ? null : e.target.value);

        let datos = {    
            fechaIni: e.target.value.length == 0 ? null : e.target.value,
            fechaFin: e.target.value.length == 0 ? null : e.target.value, 
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
                        <Grid container>
                            <Grid item xs={9}>
                                <Box sx={{pr:1}}>
                                    <Search value={busqueda} 
                                    onChange={ (e) => { cambiarBusqueda(e) } }/>
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <Box sx={{pr:1}}>
                                    <TextField
                                    sx={{marginTop:"6px", width: 1}}
                                    type="date"
                                    placeholder="Fecha economico"
                                    onChange={ (e) => { cambiarFecha(e) } }
                                    value={fecha}
                                    />
                                </Box>
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
        </Grid>
    );
};

export default IncidenciasEconomico;