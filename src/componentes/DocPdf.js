import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography  from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import BorderColorIcon from '@mui/icons-material/BorderColor';

import ModalCorrimiento from './ModalCorrimiento';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../css/docs.css';
import ModalReposicion from "./ModalReposicion";
import ModalEconomico from "./ModalEconomico";

let DocPdf = function({resp}){
    let estilosCartaPdf = {
        backgroundColor: "rgba(255, 255, 255, 0.603)",
        borderStyle: "solid",
        borderColor: "black"
    };

    const [altura, setAltura] = useState(0);
    const [modalAbrir, setModalAbrir] = useState(false);
    const [urlPDF, setUrlPDF] = useState("");
    const [modCorr, setModCorr] = useState(false);
    const [modRep, setModRep] = useState(false);
    const [modEco, setModEco] = useState(false);
    
    let closeModal = () => setModalAbrir(false);
    let cerrarCorr = () => setModCorr(false);
    let cerrarRep = () => setModRep(false);
    let cerrarEco = () => setModEco(false);

    let abrirCorr = () => setModCorr(true);
    let abrirRep = () => setModRep(true);
    let abrirEco = () => setModEco(false);

    //FUNCIONES DE ACCION PDF EN MODAL
    let abrirPdf = function(){
        setUrlPDF("data:application/pdf;base64,"+resp.ruta_doc);
        setAltura(window.innerHeight*0.9);
        setModalAbrir(true);
    };
    return(
        <>
            <Grid item xs={6} className="pdfPaquete">
                <Card sx={estilosCartaPdf} >
                    <Typography component={"p"} variant="h5" 
                        className="tituloPDF" >
                        { resp.tipo }
                    </Typography>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={4} >
                                <div className="imgPdf">
                                    <i className="bi bi-file-pdf"
                                    onClick={ abrirPdf } />
                                    <IconButton aria-label="editar" size="large">
                                        <BorderColorIcon
                                        onClick={ resp.tipo_num === 2 ? abrirEco : resp.tipo == "Corrimiento" ? abrirCorr : abrirRep }/>
                                    </IconButton>
                                </div>
                            </Grid>
                            {
                                resp.tipo_num === 2 ?
                                    <>
                                        <Grid item xs={8} className="datos-pdf">
                                            <br/>
                                            { resp.nombre }
                                            <br/>
                                            <strong>Tarjeta: </strong>
                                            { resp.tarjeta }
                                            <br/>
                                            <strong>Fecha economico: </strong>
                                            { resp.fecha_pertenece }
                                            <br/>
                                            <strong>Registrada el dia: </strong>
                                            { resp.fecha_registro }
                                            <br/>
                                            <strong>Serie memo: </strong>
                                            { resp.serie_memos }
                                            <br/>
                                            <strong>Correo contacto: </strong>
                                            { resp.correo_electronico }
                                        </Grid>
                                    </>
                                : 
                                    <>
                                        <Grid item xs={8} className="datos-pdf">
                                            <br/>
                                            { resp.nombre }
                                            <br/>
                                            <strong>Tarjeta: </strong>
                                            { resp.tarjeta }
                                            <br/>
                                            <strong>Incidencia: </strong>
                                            { resp.fecha_incidencia }
                                            <br/>
                                            <strong>Entrada: </strong>
                                            { resp.hora_ini_incidencia }
                                            <br/>
                                            <strong>Salida: </strong>
                                            { resp.hora_fin_incidencia }
                                            <br/>
                                            <strong>Observaciones: </strong>
                                            { resp.observaciones }
                                            <br/>
                                            <strong>Registrada el dia: </strong>
                                            { resp.fecha_registro }
                                            <br/>
                                            <strong>Serie memo: </strong>
                                            { resp.serie_memos }
                                            <br/>
                                            <strong>Correo contacto: </strong>
                                            { resp.correo_electronico }
                                        </Grid>
                                    </>
                            }
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Modal
                open={modalAbrir}
                onClose={closeModal}
                aria-labelledby="verDocumento"
                aria-describedby="documento de incidencia" >
                <article className="contendorVisPdf">
                        <Button 
                            onClick={closeModal} 
                            variant="contained" 
                            color="error" >
                                Cerrar documento
                        </Button>
                        <iframe
                            src={urlPDF}
                            className="documentoPdf"
                            title="visualizarPdf"
                            height={altura} />
                </article>
            </Modal>
            <Modal
            open={ resp.tipo == "Corrimiento" ? modCorr : modRep }>
                <Box sx={{height:"100vh", 
                            width:"100%", 
                            display:"flex", 
                            alignItems:"center", 
                            justifyContent:"center"}}>
                    <Box>
                        {
                            resp.tipo == "Corrimiento" ?
                                <ModalCorrimiento 
                                datos={resp}
                                cerrarModal={ cerrarCorr } />
                            :
                                <ModalReposicion 
                                datos={resp}
                                cerrarModal={ cerrarRep } />
                        }
                    </Box>
                </Box>
            </Modal>
            <Modal
            open={ modEco }>
                <Box sx={{height:"100vh", 
                            width:"100%", 
                            display:"flex", 
                            alignItems:"center", 
                            justifyContent:"center"}}>
                    <Box>
                        <ModalEconomico
                        datos={resp}
                        cerrarModal={ cerrarEco } />
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default DocPdf;