import { useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SendIcon from '@mui/icons-material/Send';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import 'dayjs/locale/en-gb';

import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Cargando from './Cargando';
import { Alertas } from "./Alertas";
import NavarAdmin from "./NavarAdmin";

import { useSelector } from "react-redux";

let CorrimientoAbierto = () => {
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
    const [fechaInc, setFechaInc] = useState("");
    const [horaChecIni, setHoraChecIni] = useState("");
    const [horaChecFin, setHoraChecFin] = useState("");
    const [tarjetaCic, setTarjetaCic] = useState("");

    //VARIABLE MENAJO DE MODAL CARGANDO
    const [espera, setEspera] =useState(false);

    let cambiarTarjeta = (e) => setTarjetaCic(e.target.value);
    
    let setFecha = (e) => {
        let ano = (e["$d"].getFullYear())+"";
        let mes = (e["$d"].getMonth()+1)+"";
        let dia = (e["$d"].getDate())+"";

        mes = mes.length <= 1 ? "0"+mes : mes;
        dia = dia.length <= 1 ? "0"+dia : dia;

        setFechaInc(ano+"-"+mes+"-"+dia);
    };

    let horaIni = (e) => {
        let hora = (e["$d"].getHours())+"";
        let min = (e["$d"].getMinutes())+"";
        let seg = (e["$d"].getSeconds())+"";

        hora = hora.length <= 1 ? "0"+hora : hora;
        min = min.length <= 1 ? "0"+min : min;
        seg = seg.length <= 1 ? "0"+seg : seg;

        setHoraChecIni(hora+":"+min+":"+seg);
    };

    let horaFin = (e) => {
        let hora = (e["$d"].getHours())+"";
        let min = (e["$d"].getMinutes())+"";
        let seg = (e["$d"].getSeconds())+"";

        hora = hora.length <= 1 ? "0"+hora : hora;
        min = min.length <= 1 ? "0"+min : min;
        seg = seg.length <= 1 ? "0"+seg : seg;

        setHoraChecFin(hora+":"+min+":"+seg);
    };

    let peticion = async (e) => {
        let alertaModal = null;

        try {
            let datos = { fechInc: fechaInc, 
                            horIniInc: horaChecIni,
                            horFinInc: horaChecFin,
                            tarjetaCic: tarjetaCic };

            alertaModal = await alertasComponent.crearModalAlerta({
                titulo: "Advertencia",
                leyenda: "¿Está seguro de enviar la incidencia?",
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
                await alertasComponent.crearModalAlerta({
                    titulo: "Informativo",
                    leyenda: "La operación fue cancelada.",
                    icono: 4,
                    activaCancelacion: false,
                    TextoConfirmacion: "Ok",
                    textoCancelacion: "Cancelar",
                    colorCancelar: "#d32f2f",
                    activa: true,
                    colorConfirmar: "#2e7d32"
                });
                return;
            }
            setEspera(true);

            await ajax.post(urlAjax.CORRIMIENTO_ABIERTA, datos, 
                {headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("Authorization")
                  }});
            setEspera(false);

            await alertasComponent.crearModalAlerta({
                titulo: "Ok",
                leyenda: "La incidencia fue enviada. Se le enviará correo electrónico con el estatus de su incidencia.",
                icono: 1,
                activaCancelacion: false,
                TextoConfirmacion: "Ok",
                textoCancelacion: "Cancelar",
                colorCancelar: "#d32f2f",
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
                <NavarAdmin nav={4} />
            </Grid>
            <Grid item xs={9} sx={{maxHeight:"98vh", overflow:"scroll"}}>
                <Cargando bool={espera} />
                <Card sx={estilosCard}>
                        <Typography component={"p"} variant='h4' sx={{textAlign:"center"}}>
                            Ingrese la tarjeta cic del profesor para crear su reposici&oacute;n de horario
                        </Typography>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField
                                        sx={EstiloTimePicker}
                                        multiline
                                        variant="filled"
                                        label="Número de tarjeta cic"
                                        placeholder="Número de tarjeta cic"
                                        value={tarjetaCic}
                                        onChange={ e  => cambiarTarjeta(e) }
                                        />
                                </Grid>
                            </Grid>
                        </CardContent>
                </Card>
                <Card sx={estilosCard}>
                    <CardContent>
                        <Typography component={"p"} variant='h4' sx={{textAlign:"center"}}>
                            Datos de la incidencia
                        </Typography>
                        <Grid container>
                            <Grid item xs={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb" >
                                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                                        <DatePicker
                                        onChange={(event) => { setFecha(event) }}
                                        sx={EstiloTimePicker} 
                                        label="Fecha incidencia" />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                                        <TimePicker
                                        onChange={(event) => { horaIni(event) }}
                                        sx={EstiloTimePicker}
                                        label="Hora checada inicio"
                                        ampm={false}
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                            seconds: renderTimeViewClock,
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                                        <TimePicker
                                        onChange={(event) => { horaFin(event) }}
                                        sx={EstiloTimePicker}
                                        label="Hora checada fin"
                                        ampm={false}
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                            seconds: renderTimeViewClock,
                                            }}
                                        />
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

export default CorrimientoAbierto;