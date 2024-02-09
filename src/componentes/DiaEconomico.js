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

import { useSelector } from "react-redux";
import { useState } from 'react';

let DiaEconomico = ({cambiarMsm}) => {
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
        let tratameintoError = async (respuesta) => {
            await alertasComponent.crearModalAlerta({
                titulo: "Error",
                leyenda: respuesta.msm,
                icono: 2,
                activaCancelacion: false,
                TextoConfirmacion: "Cerrar",
                textoCancelacion: "",
                colorCancelar: "",
                activa: true,
                colorConfirmar: "#d32f2f"
            });
        };
        let peticion = async (e) => {
            let alertaModal = null;
    
            if( !validacion() )
            {
                e.preventDefault();
                cambiarMsm({
                    titulo:"Error",
                    msm: "Revisar que todos los campos esten llenos",
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
                let datos = { fechaIni: fechaIni, fechaFin: fechaFin,
                                usuario: usuario };
    
                alertaModal = await alertasComponent.crearModalAlerta({
                    titulo: "Advertencia",
                    leyenda: "Esta seguro de enviar la incidencia",
                    icono: 5,
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
    
                let pet = await ajax.post(urlAjax.DIAECONOMICO, datos, 
                    {headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem("Authorization")
                      }});
                setEspera(false);
                cambiarMsm({
                    titulo:"Ok",
                    msm: "incidencia enviada en espera de autorizacion. Se le enviara correo electronico con el estatus de su incidencia",
                    activa: true,
                    icono: 1
                });
            } catch (e) {
                setEspera(false);
                await tratameintoError(e.response.data);
            }
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
        </>
    )
};

export default DiaEconomico;