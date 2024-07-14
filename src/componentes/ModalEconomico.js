import { useEffect, useState } from 'react';

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
import 'dayjs/locale/en-gb';

import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Cargando from './Cargando';
import { Alertas } from "./Alertas";
import dayjs from 'dayjs';

let ModalEconomico = ({datos, cerrarModal}) => {
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

    //DATOS DE LA INCIDENCIA
    const [fechaIni, setFechaIni] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    //VARIABLE MENAJO DE MODAL CARGANDO
    const [espera, setEspera] =useState(false);

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
            let datos = { fechaIni: fechaIni, 
                            fechaFin: fechaFin };

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

            await ajax.post(urlAjax.DIAECONOMICO_ABIERTA, datos, 
                {headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("Authorization")
                    }});
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
            await tratameintoError(e.response.data);
        }
    };

    useEffect( () => {
        setFechaIni(datos.fecha_ini_compensacion);
        setFechaFin(datos.fecha_fin_compensacion);
    }, [] );

    return(
        <Grid container sx={{backgroundColor:"#ffffffc9"}}>
            <Grid item xs={12} sx={{maxHeight:"98vh", overflow:"scroll"}}>
                <Cargando bool={espera} />
                <Card sx={estilosCard}>
                    <CardContent>
                        <Typography component={"p"} variant='h4' sx={{textAlign:"center"}}>
                            Datos de la incidencia
                        </Typography>
                        <Grid container>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb" >
                                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                                        <DatePicker
                                        onChange={(event) => { setFechaInicio(event) }} 
                                        sx={EstiloTimePicker}
                                        label="Fecha inicio"
                                        value={dayjs(fechaIni)} />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb" >
                                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                                        <DatePicker
                                        onChange={(event) => { setFechaFinal(event) }} 
                                        sx={EstiloTimePicker}
                                        label="Fecha fin"
                                        value={dayjs(fechaFin)} />
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
                            <Button variant="contained"
                            color="error"
                            onClick={ cerrarModal }    >
                                Cerrar
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
};

export default ModalEconomico;