import { useEffect, useState } from "react";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";







import { Simples } from "./Alertas";
import Logout from "./Logout";
import { MenuList } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { MenuItem } from '@material-ui/core';
import '../css/sidebar.css';








import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Cargando from './Cargando';
import { Alertas } from "./Alertas";

let Parametros = ({pag}) => {
    const [alertaSimple, setAlertaSimple] = 
        useState({
                    msm: "",
                    activa: false,
                    icono: 0
                });
    
    let cambiarMsm = (obj) => {
        setAlertaSimple(obj);
    };

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

    //VARIABLE MENAJO DE MODAL CARGANDO
    const [espera, setEspera] =useState(false);

    //CREAR COMPONENTE DE ALERTAS
    const alertasComponent = Alertas();

    //CONTADOR
    const [contador, setContador] = useState(0);

    //FECHAS DE QUINCENA ACTIVA
    const [inicio, setInicio] = useState(dayjs('1970-01-01'));
    const [fin, setFin] = useState(dayjs('1970-01-01'));

    //AJAX
    let setContadorMemos = async (e) => {
        try {
            let datos = { contador: contador };

            let alertaModal = await alertasComponent.crearModalAlerta({
                titulo: "Advertencia",
                leyenda: "Esta seguro de actulizar el contador. El contador regresara el conteo a 1 despues de realaizar un memo con el conteo personalizado",
                icono: 5,
                activaCancelacion: true,
                TextoConfirmacion: "Actualizar",
                textoCancelacion: "Cancelar",
                colorCancelar: "#d32f2f",
                activa: true,
                colorConfirmar: "#2e7d32"
            });

            if( !alertaModal )
            {
                e.preventDefault();
                await alertasComponent.crearModalAlerta({
                    titulo: "Cancelado",
                    leyenda: "Operacion cancelada",
                    icono: 2,
                    activaCancelacion: false,
                    TextoConfirmacion: "Cerrar",
                    textoCancelacion: "Cancelar",
                    colorCancelar: "#d32f2f",
                    activa: true,
                    colorConfirmar: "#d32f2f"
                });
                return;
            }

            setEspera(true);

            await ajax.post( urlAjax.CAMBIAR_CONTADOR, datos, 
                {headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("Authorization")
                  }} );
            
            setEspera(false);
            
            await alertasComponent.crearModalAlerta({
                titulo: "Ok",
                leyenda: "Operacion exitosa",
                icono: 1,
                activaCancelacion: false,
                TextoConfirmacion: "Cerrar",
                textoCancelacion: "Cancelar",
                colorCancelar: "#d32f2f",
                activa: true,
                colorConfirmar: "#d32f2f"
            });

        } catch (error) {
            setEspera(false);

            await alertasComponent.crearModalAlerta({
                titulo: "Error",
                leyenda: "Error al intentar actualizar el contador, intentelo de nuevo por favor",
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

    let setQuincena = async (e) => {
        try {
            let datos = { 
                inicio: crearCadenaFecha(inicio["$d"]) , 
                fin: crearCadenaFecha(fin["$d"]) 
            };

            let alertaModal = await alertasComponent.crearModalAlerta({
                titulo: "Advertencia",
                leyenda: "Esta seguro de actulizar las fechas inicio y final de la quicena."+ 
                        " Todos los dias se actulizara estas fechas por lo que si desea "+
                        "mantener las fechas personalizadas debera cambiarlas cada dia que"+
                        "se extiende.",
                icono: 5,
                activaCancelacion: true,
                TextoConfirmacion: "Actualizar",
                textoCancelacion: "Cancelar",
                colorCancelar: "#d32f2f",
                activa: true,
                colorConfirmar: "#2e7d32"
            });

            if( !alertaModal )
            {
                e.preventDefault();
                await alertasComponent.crearModalAlerta({
                    titulo: "Cancelado",
                    leyenda: "Operacion cancelada",
                    icono: 2,
                    activaCancelacion: false,
                    TextoConfirmacion: "Cerrar",
                    textoCancelacion: "Cancelar",
                    colorCancelar: "#d32f2f",
                    activa: true,
                    colorConfirmar: "#d32f2f"
                });
                return;
            }

            setEspera(true);

            await ajax.post( urlAjax.SET_QUINCENA, datos, 
                {headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("Authorization")
                  }} );
            
            setEspera(false);
            
            await alertasComponent.crearModalAlerta({
                titulo: "Ok",
                leyenda: "Operacion exitosa",
                icono: 1,
                activaCancelacion: false,
                TextoConfirmacion: "Cerrar",
                textoCancelacion: "Cancelar",
                colorCancelar: "#d32f2f",
                activa: true,
                colorConfirmar: "#d32f2f"
            });
        } catch (error) {
            setEspera(false);

            await alertasComponent.crearModalAlerta({
                titulo: "Error",
                leyenda: "Error al intentar actualizar el contador, intentelo de nuevo por favor",
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

    let getParametros = async () => {
        try {
            let pet = await ajax.post(urlAjax.GET_PARAMETROS, {}, 
                {headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("Authorization")
                  }});
            let datos = pet.data;

            setContador(datos.incremento);
            setInicio(dayjs(datos.fecha_inicio));
            setFin(dayjs(datos.fecha_fin));
            document.getElementById("contadorId").value = datos.incremento;
        } catch (error) {}
    };

    //FUNCIONES DE COMPONENTE
    let prevenirLetras = (e) => {
        try {
            if( (e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8 )
                e.preventDefault();
        } catch (error) {
            e.preventDefault();
        }
    };

    let crearCadenaFecha = (obj) => {
        let ano = (obj.getFullYear())+"";
        let mes = (obj.getMonth()+1)+"";
        let dia = (obj.getDate())+"";

        mes = mes.length <= 1 ? "0"+mes : mes;
        dia = dia.length <= 1 ? "0"+dia : dia;

        return ano+"-"+mes+"-"+dia;
    };

    let deshabilitarFinesSem = (dia) => {
        let dayOfWeek = dia["$d"].getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    };

    let cambiarContadorMemo = (e) => setContador(e.target.value);
    let cambiarFechaIni = (e) => setInicio(dayjs(crearCadenaFecha(e["$d"])));
    let cambiarFechaFin = (e) => setFin(dayjs(crearCadenaFecha(e["$d"])));

    useEffect( () => {
        let obtieneConteo = async () => getParametros();
        obtieneConteo();
    }, [] )

    return(
       <>
            <Grid container >
                <Grid item xs={3} sx={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}} >
                    <MenuList>
                        <MenuItem >
                            <NavLink 
                                className={"link"}
                                aria-current={"Carga datos de profesor"}
                                to={"/menu-administrador/cargaDatProf"} >
                                    <Typography component="span" variant="h5" textAlign={"right"} >
                                        Carga datos de profesor
                                    </Typography>
                            </NavLink>
                        </MenuItem>
                        <MenuItem >
                            <NavLink
                                className={"link"} 
                                aria-current={"Carga datos de profesor"}
                                to={"/menu-administrador/inciencias"} >
                                    <Typography component="span" variant="h5" textAlign={"right"} >
                                        Inciencias
                                    </Typography>
                            </NavLink>
                        </MenuItem>
                        <MenuItem >
                            <NavLink
                                className={"sidebar"} 
                                aria-current={"Parametros"}
                                to={"/menu-administrador/parametros"} >
                                    <Typography component="span" variant="h5" textAlign={"right"} >
                                        Parametros
                                    </Typography>
                            </NavLink>
                        </MenuItem>
                        <MenuItem >
                            <NavLink
                                className={"link"} 
                                aria-current={"Dias Economicos"}
                                to={"/menu-administrador/incidenciasEconomicos"} >
                                    <Typography component="span" variant="h5" textAlign={"right"} >
                                        Dias Economicos
                                    </Typography>
                            </NavLink>
                        </MenuItem>
                    </MenuList>
                    <Logout/>
                </Grid>
                <Grid item xs={9} >
                    <Simples obj={alertaSimple} />
                    <Grid item xs={12} >
                        <Cargando bool={espera} />
                        <Card sx={estilosCard}>
                            <Typography component={"p"} variant='h4' sx={{textAlign:"center"}}>
                                Conteo de memos
                            </Typography>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="contadorId"
                                            sx={EstiloTimePicker}
                                            multiline
                                            variant="filled"
                                            placeholder="Cambiar conteo de memos"
                                            onKeyDown={ (e) => { prevenirLetras(e) }}
                                            onChange={ (e) => cambiarContadorMemo(e) }
                                            />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" 
                                            color="success"
                                            onClick={ (e) => { setContadorMemos(e) } } >
                                            Cambiar conteo
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Card sx={estilosCard}>
                            <Typography component={"p"} variant='h4' sx={{textAlign:"center"}}>
                                Cambiar fecha inicio y fin de quincena
                            </Typography>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DemoContainer components={['DatePicker']}>
                                                <DatePicker
                                                onChange={(event) => { cambiarFechaIni(event) }} 
                                                sx={EstiloTimePicker}

                                                label="Fecha inicio quicena"
                                                value={inicio} />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DemoContainer components={['DatePicker']}>
                                                <DatePicker
                                                onChange={(event) => { cambiarFechaFin(event) }} 
                                                sx={EstiloTimePicker}
                                                
                                                label="Fecha fin quncena"
                                                value={fin} />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" 
                                            color="success"
                                            onClick={ (e) => { setQuincena(e) } } >
                                            Cambiar fechas
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
       </>
    )
};

export default Parametros;