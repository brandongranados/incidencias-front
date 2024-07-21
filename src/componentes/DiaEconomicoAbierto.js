import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SendIcon from '@mui/icons-material/Send';
import Button from "@mui/material/Button";
import 'dayjs/locale/en-gb';

import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Cargando from './Cargando';
import { Alertas } from "./Alertas";

import { useState } from 'react';
import NavarAdmin from './NavarAdmin';
import { Box } from "@mui/material";

let DiaEconomicoAbierto = () => {

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
        const [tarjetaCic, setTarjetaCic] = useState("");
    
        //VARIABLE MENAJO DE MODAL CARGANDO
        const [espera, setEspera] =useState(false);

        let cambiarTarjeta = (e) => setTarjetaCic(e.target.value);
        let setFechaInicio = (e) => setFechaIni(e.target.value.length == 0 ? null : e.target.value);
        let setFechaFinal = (e) => setFechaFin(e.target.value.length == 0 ? null : e.target.value);

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
                let datos = { fechaIni: fechaIni, 
                                fechaFin: fechaFin,
                                tarjetaCic: tarjetaCic };
    
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
    
                await ajax.post(urlAjax.DIAECONOMICO_ABIERTA, datos);
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
                <NavarAdmin nav={5} />
            </Grid>
            <Grid item xs={9} sx={{maxHeight:"98vh", overflow:"scroll"}}>
                <Cargando bool={espera} />
                <Card sx={estilosCard}>
                        <Typography component={"p"} variant='h4' sx={{textAlign:"center"}}>
                            Ingrese la tarjeta cic del profesor para crear su d&iacute;a econ&oacute;mico
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
                            <Grid item xs={6}>
                                <Box sx={{pr:1}}>
                                    <TextField
                                    sx={{width: 1}}
                                    type="date"
                                    placeholder="Fecha inicio"
                                    onChange={(event) => { setFechaInicio(event) }}
                                    value={fechaIni}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{pr:1}}>
                                    <TextField
                                    sx={{width: 1}}
                                    type="date"
                                    placeholder="Fecha fin"
                                    onChange={(event) => { setFechaFinal(event) }}
                                    value={fechaFin}
                                    />
                                </Box>
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

export default DiaEconomicoAbierto;