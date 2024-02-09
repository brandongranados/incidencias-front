import { useState } from "react";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import DocPdf from "./DocPdf";
import Search from "./Search";

import '../css/incidencias.css';

let Inciencias = function(){
    //ESTILOS
    const navar = {
        backgroundColor: "#1976d2c6",
        height:"10vh"
    };

    //DATOS MODAL
    const [modalAbrir, setModalAbrir] = useState(false);
    //DATOS PDF
    const [urlPDF, setUrlPDF] = useState('');

    //FILTROS de incidencias
    const [busqueda, setBusqueda] = useState("");
    const [fechaIni, setFechaIni] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());

    //ALTURA MODAL
    const [altura, setAltura] = useState(0);

    //FUNCIONES DE MODAL
    let openModal = function () {
        setAltura(window.innerHeight*0.9);
        setModalAbrir(true);
    };
    let closeModal = function () {
        setModalAbrir(false);
    };

    //FUNCIONES DE ACCION PDF EN MODAL
    let abrirPdf = function(urlNueva){
        setUrlPDF("data:application/pdf;base64,"+urlNueva);
        openModal();
    };

    return(
        <div className="caja-incidencias">
            <AppBar component={"nav"} position="static" style={navar}>
                <Toolbar>
                    <section className="posicion-navar-search">
                        <Search/>
                    </section>
                    <section className="posicion-navar-fechas">
                        <article className="campos-fechas">
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Fecha inicio" />
                                </DemoContainer>
                            </LocalizationProvider>
                        </article>
                        <article className="campos-fechas">
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Fecha fin" />
                                </DemoContainer>
                            </LocalizationProvider>
                        </article>
                    </section>
                </Toolbar>
            </AppBar>
            <section className="listaDocsPdf">
                <Grid item xs={12}>
                    <Grid container >
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                        <DocPdf agregarUrl={abrirPdf} />
                    </Grid>
                    <Modal
                        open={modalAbrir}
                        onClose={closeModal}
                        aria-labelledby="verDocumento"
                        aria-describedby="documento de incidencia" >
                        <article className="contendorVisPdf">
                                <Button onClick={closeModal} variant="contained" color="error" >Cerrar documento</Button>
                                <iframe
                                    src={urlPDF}
                                    className="documentoPdf"
                                    title="visualizarPdf"
                                    height={altura} />
                        </article>
                    </Modal>
                </Grid>
            </section>
            <section className="paginacion">
                <Pagination count={10} variant="outlined" shape="rounded" />
            </section>
        </div>
    );
};

export default Inciencias;