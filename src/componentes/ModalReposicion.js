import { useEffect, useState } from "react";

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

import Cargando from "./Cargando";
import { Alertas } from "./Alertas";

import '../css/sidebar.css';
/**
 * DATOS DE INCIDENCIA 1
 * DATOS DE COMPENSACION 2
 * 
*/

let ModalReposicion = ({datos, cerrarModal}) => {
    const estilosCard = {
        backgroundColor: "rgba(255, 255, 255, 0.706)",
        borderStyle: "solid",
        borderColor: "black",
        marginTop: "0.7%",
        marginLeft: "0.7%",
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
    let setFecha = (e, index) => {

        if( index != null )
        {
            let busq = fechaCom.find( (iterador) => iterador.index == index );
            let izq = fechaCom.filter( (iterador) => iterador.index < index );
            let der = fechaCom.filter( (iterador) => iterador.index > index );

            setFechaCom([ ...izq, { index:busq.index, fecha: e.target.value.length == 0 ? null: e.target.value, bool:true }, ...der ]);
        }
        else
            setFechaInc(e.target.value.length == 0 ? null: e.target.value);
    };
    let setHoraInicio = (e, index) => {

        if( index != null )
        {
            let busq = horaChecIniCom.find( (iterador) => iterador.index == index );
            let izq = horaChecIniCom.filter( (iterador) => iterador.index < index );
            let der = horaChecIniCom.filter( (iterador) => iterador.index > index );

            setHoraChecIniCom([ ...izq, { index:busq.index, horaIni: e.target.value.length == 0 ? null: e.target.value, bool:true }, ...der ]);
        }
        else
            setHoraChecIni(e.target.value.length == 0 ? null: e.target.value);
    };
    let setHoraFinal = (e, index) => {

        if( index != null )
        {
            let busq = horaChecFinCom.find( (iterador) => iterador.index == index );
            let izq = horaChecFinCom.filter( (iterador) => iterador.index < index );
            let der = horaChecFinCom.filter( (iterador) => iterador.index > index );

            setHoraChecFinCom([ ...izq, { index:busq.index, horaFin: e.target.value.length == 0 ? null: e.target.value, bool:true }, ...der ]);
        }
        else
            setHoraChecFin(e.target.value.length == 0 ? null: e.target.value);
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
    let peticion = async (e) => {
        let array = [];
        let alertaModal = null;

        for(let i=0; i<fechaCom.length; i++)
            array.push({ fecha: fechaCom[i].fecha, 
                            horaInicio: horaChecIniCom[i].horaIni, 
                            horaFin: horaChecFinCom[i].horaFin,
                            horaCubre: horaCubre[i].numero  });

        try {
            let data = { 
                            fechInc: fechaInc, 
                            horIniInc: horaChecIni,
                            horFinInc: horaChecFin, 
                            obs: valorObserv,
                            reposicion: array,
                            idIncidencia : datos.id_prof_incidencia
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
                cerrarModal();
                return;
            }
            setEspera(true);

            await ajax.post(urlAjax.REPOSICION_ABIERTA_ACTUALIZA, data);

            setEspera(false);
            
            await alertasComponent.crearModalAlerta({
                titulo: "Ok",
                leyenda: "Incidencia actualizada.",
                icono: 1,
                activaCancelacion: false,
                TextoConfirmacion: "Cerrar",
                textoCancelacion: "",
                colorCancelar: "",
                activa: true,
                colorConfirmar: "#d32f2f"
            });

            window.location.reload();
        } catch (e) {
            setEspera(false);
            await tratameintoError(e.response.data);
        }
    };
    let petcion2 = async (id) => {

        let data = [];

        try {
            let datos = { id: id };

            setEspera(true);

            let res = await ajax.post(urlAjax.VISULIZAR_MEMOS_INC_COMP, datos);

            data = await res.data;

            setEspera(false);

        } catch (e) {
            setEspera(false);
        }

        return data;
    };

    useEffect( () => {
        let compensacion = null;

        setFechaInc(datos.fecha_incidencia);
        setHoraChecIni(datos.hora_ini_incidencia);
        setHoraChecFin(datos.hora_fin_incidencia);
        setValorObserv(datos.observaciones);
        
        let devuelta = async () => {
            let i = 0;
            let din = [];
            let ini = [];
            let fin = [];
            let fech = [];
            let horas = [];

            compensacion = await petcion2(datos.id_prof_incidencia);

            compensacion.forEach( iterador => {

                din = [ ...din, { index:i } ];
                fech = [...fech, {index: i, fecha: iterador.fecha_compensacion, bool:true}];
                ini = [...ini, {index: i, horaIni: iterador.hora_ini_compensacion, bool:true}];
                fin = [...fin, {index: i, horaFin: iterador.hora_fin_compensacion, bool:true}];
                horas = [ ...horas, { index: i, numero: iterador.horas_cubre} ];
                i+=1;

                if( din.length == compensacion.length )
                {
                    setCompesarDin(din);
                    setFechaCom(fech);
                    setHoraChecIniCom(ini);
                    setHoraChecFinCom(fin);
                    setHoraCubre(horas);
                }
            });
        };
        devuelta();

    }, [] );

    return(
        <Grid container sx={{overflow:"hidden", backgroundColor:"#ffffffc9"}}>
            <Grid item xs={12} sx={{maxHeight:"98vh", overflow:"scroll"}} >
                <Cargando bool={espera} />
                <Card sx={estilosCard}>
                    <CardContent>
                        <Typography component={"p"} variant='h4' sx={{textAlign:"center"}}>
                            Datos de la reposici&oacute;n
                        </Typography>
                            <Grid container>
                                <Grid item xs={3}>
                                    <Box sx={{pr:1}}>
                                        <TextField
                                        sx={{width: 1}}
                                        type="date"
                                        placeholder="Fecha incidencia"
                                        onChange={(event) => setFecha(event, null)}
                                        value={fechaInc}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{pr:1}}>
                                        <TextField
                                        sx={{width: 1}}
                                        type="time"
                                        placeholder="Hora checada inicio"
                                        onChange={(event) => setHoraInicio(event, null)}
                                        value={horaChecIni}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{pr:1}}>
                                        <TextField
                                        sx={{width: 1}}
                                        type="time"
                                        placeholder="Hora checada fin"
                                        onChange={(event) => setHoraFinal(event, null)}
                                        value={horaChecFin}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{pr:1}}>
                                        <TextField
                                        onChange={setObservaciones}
                                        sx={{width:1}}
                                        variant="filled"
                                        label="Observaciones"
                                        placeholder="Observaciones"
                                        value={valorObserv} />
                                    </Box>
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
                            {
                                compesarDin.map( (iterador) => (
                                    <Grid container index={iterador.index}>
                                        <Grid item xs={3}>
                                            <Box sx={{pr:1, pt:1}}>
                                                <TextField
                                                sx={{width: 1}}
                                                type="date"
                                                placeholder="Fecha incidencia"
                                                onChange={(event) => setFecha(event, iterador.index)}
                                                value={fechaCom[iterador.index].fecha}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{pr:1, pt:1}}>
                                                <TextField
                                                sx={{width: 1}}
                                                type="time"
                                                placeholder="Hora checada inicio"
                                                onChange={(event) => setHoraInicio(event, iterador.index)}
                                                value={horaChecIniCom[iterador.index].horaIni}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{pr:1, pt:1}}>
                                                <TextField
                                                sx={{width: 1}}
                                                type="time"
                                                placeholder="Hora checada fin"
                                                onChange={(event) => setHoraFinal(event, iterador.index)}
                                                value={horaChecFinCom[iterador.index].horaFin}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{pr:1, pt:1}}>
                                                <TextField
                                                onChange={ (event) => setHorasCubre(event, iterador.index) }
                                                variant="filled"
                                                label="Horas cubre"
                                                value={horaCubre[iterador.index].numero} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                ) )
                            }
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
                                Actualizar incidencia
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

export default ModalReposicion;