import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import * as crypto from "crypto-js";

import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import Logout from "./Logout";
import Cargando from "./Cargando";
import { Alertas } from "./Alertas";

let AgregarDatosFaltan = () => {

    const [obligatorio, setObligatorio] = useState(true);
    //DATOS USUARIO
    const usuario = useSelector( state => state.usuario.nombreUsuario );
    //VARIABLE MENAJO DE MODAL CARGANDO
    const [espera, setEspera] =useState(false);
    //CREAR COMPONENTE DE ALERTAS
    const alertasComponent = Alertas();

    //DATOS OBLOIGATORIOS
    const [correo, setCorreo] = useState("");
    const [contra, setContra] = useState("");

    let cambiarCorreo = (e) => setCorreo(e.target.value);
    let cambiarContra = (e) => setContra(e.target.value.replace(" ", ""));

    let validaDatos = () => {
        const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let bool =  true;
        
        if( !expresionCorreo.test(correo) )
            bool = false;

        if( contra.replace(" ", "").length == 0 )
            bool = false;

        return bool;
    };
    let revisarDatos = async () => {
        try {
            let pet = await ajax.post(urlAjax.DATOS_OBLIGATORIOS, { usuario: usuario },
                {headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("Authorization")
                  }});

            let datos = await pet.data;

            if( datos.cantidad == 0 )
                  setObligatorio(false);
            else
                  setObligatorio(true);
                  
        } catch (error) {
            console.log(error);
        }
    };
    let ejecutarAjax = async (e) => {
        let datos = {usuario: usuario, correo: correo, contra: contra };
        setObligatorio(false);
        let alerta = await alertasComponent.crearModalAlerta({
                            titulo: "Advertencia",
                            leyenda: "Esta seguro de enviar los datos",
                            icono: 5,
                            activaCancelacion: true,
                            TextoConfirmacion: "Enviar",
                            textoCancelacion: "Cancelar",
                            colorCancelar: "#d32f2f",
                            activa: true,
                            colorConfirmar: "#2e7d32"
                        });
        if( !alerta )
        {
            e.preventDefault();
            alerta = await alertasComponent.crearModalAlerta({
                titulo: "Cancelado",
                leyenda: "Debe enviar estos parametros para iniciar sesion",
                icono: 3,
                activaCancelacion: false,
                TextoConfirmacion: "Ok",
                textoCancelacion: "",
                colorCancelar: "",
                activa: true,
                colorConfirmar: "#2e7d32"
            });
            setObligatorio(true);
            return;
        }

        if( !validaDatos() )
        {
            e.preventDefault();
            alerta = await alertasComponent.crearModalAlerta({
                titulo: "Error",
                leyenda: "Verifique el correo electronico sea valido y la contrasena no este vacia",
                icono: 2,
                activaCancelacion: false,
                TextoConfirmacion: "Ok",
                textoCancelacion: "",
                colorCancelar: "",
                activa: true,
                colorConfirmar: "#d32f2f"
            });
            setObligatorio(true);
            return;
        }

        setEspera(true);

        try {
            let pet = await ajax.post(urlAjax.ASIGNAR_OBLIGATORIOS, datos, 
                {headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("Authorization")
                  }});
            setEspera(false);
            alerta = await alertasComponent.crearModalAlerta({
                titulo: "Ok",
                leyenda: "Los datos fueron agregados correctamente, la proxima ves que inicie sesion utilice la contrasena nueva",
                icono: 1,
                activaCancelacion: false,
                TextoConfirmacion: "Ok",
                textoCancelacion: "",
                colorCancelar: "",
                activa: true,
                colorConfirmar: "#2e7d32"
            });
        } catch (error) {
            setEspera(false);
            alerta = await alertasComponent.crearModalAlerta({
                titulo: "Error",
                leyenda: "Error interno notificar con el jefe de departamento la situacion",
                icono: 2,
                activaCancelacion: false,
                TextoConfirmacion: "Ok",
                textoCancelacion: "",
                colorCancelar: "",
                activa: true,
                colorConfirmar: "#d32f2f"
            });
            setObligatorio(true);
        }
    };

    useEffect( ()=>{
        let revisa = async () => {
            await revisarDatos();
        };
        revisa();
    }, [] );

    return(
        <Modal
        open={obligatorio}
        aria-labelledby="Titulo Necesario"
        aria-describedby="Necesario" >
            <Box sx={{height:"100vh", width:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                <Cargando bool={espera} />
                <Card sx={{backgroundColor:"#fffffff0"}}>
                    <CardContent>
                        <Typography textAlign={"center"} gutterBottom variant="h3" component="div">Ingresar datos obligatorios</Typography>
                        <Box sx={{marginBottom:"2%"}}>
                            <TextField
                            multiline
                            onChange={ (e) => cambiarCorreo(e) }
                            sx={{marginRight:"1%", width:"49%"}}
                            variant="filled"
                            label="Correo electronico"
                            placeholder="Correo electronico" />
                            <TextField
                            onChange={ (e) => cambiarContra(e) }
                            multiline
                            variant="filled"
                            label="Restablecer contrasena"
                            placeholder="Restablecer contrasena" />
                        </Box>
                        <Box sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                            <Button variant="contained" size="large" color="success" onClick={ejecutarAjax} >
                                Enviar correo y restablecer contrasena
                            </Button>
                            <Logout />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    )
};

export default AgregarDatosFaltan;