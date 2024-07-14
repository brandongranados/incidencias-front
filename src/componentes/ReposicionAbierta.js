import { useState } from "react";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import 'dayjs/locale/en-gb';

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';

import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import { useSelector } from "react-redux";

import Cargando from "./Cargando";
import { Alertas } from "./Alertas";
import NavarAdmin from './NavarAdmin';
import FechaHoraReposicionAbierta from "./FechaHoraReposicionAbierta";

import '../css/sidebar.css';

/**
 * DATOS DE INCIDENCIA 1
 * DATOS DE COMPENSACION 2
 * 
*/

let ReposicionAbierta = () => {
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

    //VARIABLE MENAJO DE MODAL CARGANDO
    const [espera, setEspera] =useState(false);

    //CAMPOS DE COMPENSACION DINAMICOS
    const [compesarDin, setCompesarDin] = useState([]);
    //DATOS DE COMPENSACION
    const [fechaCom, setFechaCom] = useState([]);
    const [horaChecIniCom, setHoraChecIniCom] = useState([]);
    const [horaChecFinCom, setHoraChecFinCom] = useState([]);
    const [horaCubre, setHoraCubre] = useState([]);
    //CAMPOS DE DATOS DE INCIDENCIA
    const [valorObserv, setValorObserv] = useState("");
    const [fechaInc, setFechaInc] = useState("");
    const [horaChecIni, setHoraChecIni] = useState(null);
    const [horaChecFin, setHoraChecFin] = useState(null);

    //DATOS USUARIO
    const [tarjetaCic, setTarjetaCic] = useState("");

    let cambiarTarjeta = (e) => setTarjetaCic(e.target.value);

    let agregarCompensacion = () => {
        setCompesarDin([ ...compesarDin, { index:compesarDin.length+1 } ]);
        setFechaCom([...fechaCom, {index: compesarDin.length+1, fecha: "", bool:false}]);
        setHoraChecIniCom([...horaChecIniCom, {index: compesarDin.length+1, horaIni: "", bool:false}]);
        setHoraChecFinCom([...horaChecFinCom, {index: compesarDin.length+1, horaFin: "", bool:false}]);
    };
    let quitarCompensacion = () => {
        setCompesarDin( compesarDin.filter( (iterador) => iterador.index < compesarDin[compesarDin.length-1].index ) );
        setFechaCom( fechaCom.filter( (iterador) => iterador.index < fechaCom[fechaCom.length-1].index ) );
        setHoraChecIniCom( horaChecIniCom.filter( (iterador) => iterador.index < horaChecIniCom[horaChecIniCom.length-1].index ) );
        setHoraChecFinCom( horaChecFinCom.filter( (iterador) => iterador.index < horaChecFinCom[horaChecFinCom.length-1].index ) );
    };
    let setObservaciones = (e) => {
        let menos = "";
        let numero = e.target.value; 
        
        if( numero.charAt(0) == "-" )
        {
            menos = "-";
            numero = numero.replace("-", "");
        }

        for(let i=0; i<numero.length; i++)
            if( !(numero.charAt(i).charCodeAt() > 47 && numero.charAt(i).charCodeAt() < 58) )
                numero = numero.replace(numero.charAt(i), "");

        setValorObserv(menos+numero);
    };
    let setHorasCubre = (e, index) => {

        let numero = e.target.value;
        let izq = horaCubre.filter( iterador => iterador.index < index );
        let der = horaCubre.filter( iterador => iterador.index > index );

        if( index == null )
            return;

        for(let i=0; i<numero.length; i++)
            if( !(numero.charAt(i).charCodeAt() > 47 && numero.charAt(i).charCodeAt() < 58) )
                numero = numero.replace(numero.charAt(i), "");

        setHoraCubre([ ...izq, { index:index, numero: numero }, ...der ]);
    };
    let setFecha = (e, index) => {
        let ano = (e["$d"].getFullYear())+"";
        let mes = (e["$d"].getMonth()+1)+"";
        let dia = (e["$d"].getDate())+"";

        mes = mes.length <= 1 ? "0"+mes : mes;
        dia = dia.length <= 1 ? "0"+dia : dia;

        if( index != null )
        {
            let busq = fechaCom.find( (iterador) => iterador.index == index );
            let izq = fechaCom.filter( (iterador) => iterador.index < index );
            let der = fechaCom.filter( (iterador) => iterador.index > index );

            setFechaCom([ ...izq, { index:busq.index, fecha: ano+"-"+mes+"-"+dia, bool:true }, ...der ]);
        }
        else
            setFechaInc(ano+"-"+mes+"-"+dia);
    };
    let setHoraInicio = (e, index) => {
        let hora = (e["$d"].getHours())+"";
        let min = (e["$d"].getMinutes())+"";
        let seg = (e["$d"].getSeconds())+"";

        hora = hora.length <= 1 ? "0"+hora : hora;
        min = min.length <= 1 ? "0"+min : min;
        seg = seg.length <= 1 ? "0"+seg : seg;

        if( index != null )
        {
            let busq = horaChecIniCom.find( (iterador) => iterador.index == index );
            let izq = horaChecIniCom.filter( (iterador) => iterador.index < index );
            let der = horaChecIniCom.filter( (iterador) => iterador.index > index );

            setHoraChecIniCom([ ...izq, { index:busq.index, horaIni: hora+":"+min+":"+seg, bool:true }, ...der ]);
        }
        else
            setHoraChecIni(hora+":"+min+":"+seg);
    };
    let setHoraFinal = (e, index) => {
        let hora = (e["$d"].getHours())+"";
        let min = (e["$d"].getMinutes())+"";
        let seg = (e["$d"].getSeconds())+"";

        hora = hora.length <= 1 ? "0"+hora : hora;
        min = min.length <= 1 ? "0"+min : min;
        seg = seg.length <= 1 ? "0"+seg : seg;

        if( index != null )
        {
            let busq = horaChecFinCom.find( (iterador) => iterador.index == index );
            let izq = horaChecFinCom.filter( (iterador) => iterador.index < index );
            let der = horaChecFinCom.filter( (iterador) => iterador.index > index );

            setHoraChecFinCom([ ...izq, { index:busq.index, horaFin: hora+":"+min+":"+seg, bool:true }, ...der ]);
        }
        else
            setHoraChecFin(hora+":"+min+":"+seg);
    };
    let validacion = () => {
        let bool = true;

        if( fechaCom.length == 0 || horaChecIniCom.length == 0 || horaChecFinCom.length == 0 )
            return false;

        try{
            let fechaComBool = fechaCom.find( (iterador) => !iterador.bool );
            let horaChecIniComBool = horaChecIniCom.find( (iterador) => !iterador.bool );
            let horaChecFinComBool = horaChecFinCom.find( (iterador) => !iterador.bool );

            if( Array.isArray(fechaComBool) )
                if( fechaComBool.length > 0 )
                    bool = false;
            if( Array.isArray(horaChecIniComBool) )
                if( horaChecIniComBool.length > 0 )
                    bool = false;
            if( Array.isArray(horaChecFinComBool) )
                if( horaChecFinComBool.length > 0 )
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
        let array = [];
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

        for(let i=0; i<fechaCom.length; i++)
            array.push({ fecha: fechaCom[i].fecha, 
                            horaInicio: horaChecIniCom[i].horaIni, 
                            horaFin: horaChecFinCom[i].horaFin,
                            horaCubre: horaCubre[i].numero  });

        try {
            let datos = { 
                            fechInc: fechaInc, 
                            horIniInc: horaChecIni,
                            horFinInc: horaChecFin, 
                            obs: valorObserv,
                            tarjetaCic: tarjetaCic, 
                            reposicion: array
                        };

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

            await ajax.post(urlAjax.REPOSICION_ABIERTA, datos, 
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

    return(
        <Grid container sx={{overflow:"hidden"}}>
            <Grid item xs={3} sx={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}} >
                <NavarAdmin nav={3} />
            </Grid>
            <Grid item xs={9} sx={{maxHeight:"98vh", overflow:"scroll"}} >
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
                                        label="Numero de tarjeta cic"
                                        placeholder="Numero de tarjeta cic"
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
                                <Grid item xs={3}>
                                    <LocalizationProvider 
                                    dateAdapter={AdapterDayjs} 
                                    adapterLocale="en-gb" >
                                        <DemoContainer components={['DatePicker', 'TimePicker']}>
                                            <DatePicker sx={EstiloTimePicker} label="Fecha incidencia" 
                                                onChange={(event) => setFecha(event, null)} />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={3}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DemoContainer components={['DatePicker', 'TimePicker']}>
                                            <TimePicker
                                            onChange={(event) => setHoraInicio(event, null)}
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
                                <Grid item xs={3}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DemoContainer components={['DatePicker', 'TimePicker']}>
                                            <TimePicker
                                            onChange={(event) => setHoraFinal(event, null)}
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
                                <Grid item xs={3}>
                                    <TextField
                                    onChange={setObservaciones}
                                    className='elemetsFormulario'
                                    multiline
                                    variant="filled"
                                    label="Observaciones"
                                    placeholder="Observaciones"
                                    value={valorObserv} />
                                </Grid>
                            </Grid>
                    </CardContent>
                </Card>
                <Card sx={estilosCard}>
                    <CardContent>
                        <Box sx={{display:"flex", justifyContent:"center"}}>
                            <Typography component={"span"} variant='h4'>
                                Datos de la compensaci&oacute;n                              
                            </Typography>
                            <Button variant="contained"
                                onClick={agregarCompensacion} 
                                color="success"
                                sx={{marginLeft:"1%"}} >
                                <i className="bi bi-plus-lg"></i>
                            </Button>
                            <Button variant="contained" 
                                onClick={quitarCompensacion}
                                color="error" 
                                sx={{marginLeft:"1%"}} >
                                <i className="bi bi-x-lg"></i>
                            </Button>
                        </Box>
                        <Grid container>
                            {
                                compesarDin.map( (iterador) => (
                                    <FechaHoraReposicionAbierta 
                                    index={iterador.index}
                                    setFecha={setFecha}
                                    setHoraInicio={setHoraInicio}
                                    setHoraFinal={setHoraFinal}
                                    setHorasCubre={setHorasCubre}
                                    horaCubre={horaCubre}
                                    indice={iterador.index} />
                                ) )
                            }
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

export default ReposicionAbierta;