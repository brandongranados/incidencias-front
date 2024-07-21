import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SendIcon from '@mui/icons-material/Send';
import Button from "@mui/material/Button";

import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Cargando from './Cargando';
import { Alertas } from "./Alertas";
import NavarUsuario from "./NavarUsuario";

import { useSelector } from "react-redux";
import { useState } from 'react';

let DiaEconomico = () => {
    const estilosCard = {
        backgroundColor: "rgba(255, 255, 255, 0.706)",
        borderStyle: "solid",
        borderColor: "black",
        marginTop: "0.7%",
        marginLeft: "0.7%",
    };
    const EstiloTimePicker = {
        width: '98%!important',
    };

        //CREAR COMPONENTE DE ALERTAS
        const alertasComponent = Alertas();

        //DATOS USUARIO
        const usuario = useSelector( state => state.usuario.nombreUsuario );
    
        //DATOS DE LA INCIDENCIA
        const [fechaIni, setFechaIni] = useState("");
        const [fechaFin, setFechaFin] = useState("");
    
        //VARIABLE MENAJO DE MODAL CARGANDO
        const [espera, setEspera] =useState(false);

        let deshabilitarFinesSem = (dia) => {
            let dayOfWeek = dia["$d"].getDay();
            return dayOfWeek === 0 || dayOfWeek === 6;
        };
        let setFechaInicio = (e) => {
            let ano = (e["$d"].getFullYear())+"";
            let mes = (e["$d"].getMonth()+1)+"";
            let dia = (e["$d"].getDate())+"";
    
            mes = mes.length <= 1 ? "0"+mes : mes;
            dia = dia.length <= 1 ? "0"+dia : dia;
    
            setFechaIni(ano+"-"+mes+"-"+dia);
        };
        let setFechaFinal = (e) => {
            let ano = (e["$d"].getFullYear())+"";
            let mes = (e["$d"].getMonth()+1)+"";
            let dia = (e["$d"].getDate())+"";
    
            mes = mes.length <= 1 ? "0"+mes : mes;
            dia = dia.length <= 1 ? "0"+dia : dia;
    
            setFechaFin(ano+"-"+mes+"-"+dia);
        };
        let validacion = () => {
            let bool = true;
    
            try{
    
                if( fechaIni.length == 0 )
                    bool = false;
                if( fechaFin.length == 0 )
                    bool = false;
    
            }catch(error){
                bool = false;
            }
    
            return bool;
    
        };
        let peticion = async (e) => {
            let alertaModal = null;
    
            if( !validacion() )
            {
                e.preventDefault();
                await alertasComponent.crearModalAlerta({
                    titulo: "Informativo",
                    leyenda: "Revisar que todos los campos estén llenos.",
                    icono: 3,
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
                let datos = { fechaIni: fechaIni, fechaFin: fechaFin,
                                usuario: usuario };
    
                alertaModal = await alertasComponent.crearModalAlerta({
                    titulo: "Advertencia",
                    leyenda: "¿Está seguro de enviar la incidencia?",
                    icono: 4,
                    activaCancelacion: true,
                    TextoConfirmacion: "Enviar",
                    textoCancelacion: "Cancelar",
                    colorCancelar: "#d32f2f",
                    activa: true,
                    colorConfirmar: "#2e7d32"
                });
                if( !alertaModal )
                {
                    e.preventDefault();
                    await alertasComponent.crearModalAlerta({
                        titulo: "Informativo",
                        leyenda: "La operación fue cancelada.",
                        icono: 4,
                        activaCancelacion: false,
                        TextoConfirmacion: "Ok",
                        textoCancelacion: "",
                        colorCancelar: "",
                        activa: true,
                        colorConfirmar: "#2e7d32"
                    });
                    return;
                }
                setEspera(true);
    
                await ajax.post(urlAjax.DIAECONOMICO, datos);
                setEspera(false);
                await alertasComponent.crearModalAlerta({
                    titulo: "Ok",
                    leyenda: "La incidencia fue enviada en espera de autorización. Se le enviará correo electrónico con el estatus de su incidencia.",
                    icono: 1,
                    activaCancelacion: false,
                    TextoConfirmacion: "Ok",
                    textoCancelacion: "",
                    colorCancelar: "",
                    activa: true,
                    colorConfirmar: "#2e7d32"
                });
            } catch (e) {
                setEspera(false);
                await alertasComponent.crearModalAlerta({
                    titulo: "Error",
                    leyenda: e.response.data,
                    icono: 2,
                    activaCancelacion: false,
                    TextoConfirmacion: "Cerrar",
                    textoCancelacion: "",
                    colorCancelar: "",
                    activa: true,
                    colorConfirmar: "#d32f2f"
                });
            }
        };
    
    return(
        <Grid container>
            <Grid item xs={3} 
                sx={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}} >
                <NavarUsuario nav={3} />
            </Grid>
            <Grid item xs={9} sx={{maxHeight:"98vh", overflow:"scroll"}}>
                <Cargando bool={espera} />
                <Card sx={estilosCard}>
                    <CardContent>
                        <Typography component={"p"} variant='h4' sx={{textAlign:"center"}}>
                            Datos de la incidencia
                        </Typography>
                        <Grid container>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                                        <DatePicker
                                        onChange={(event) => { setFechaInicio(event) }} 
                                        sx={EstiloTimePicker}
                                        shouldDisableDate={deshabilitarFinesSem}
                                        label="Fecha inicio" />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                                        <DatePicker
                                        onChange={(event) => { setFechaFinal(event) }} 
                                        sx={EstiloTimePicker}
                                        shouldDisableDate={deshabilitarFinesSem}
                                        label="Fecha fin" />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={estilosCard}>
                    <CardContent>
                        <Grid item xs={12} sx={
                        {textAlign:"center" }}>
                            <Button variant="contained"
                            color="success" 
                            startIcon={<SendIcon/>}
                            onClick={ (event) =>{ peticion(event) } }    >
                                Enviar incidencia
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
};

export default DiaEconomico;