import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import DomainIcon from '@mui/icons-material/Domain';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { sinAcceso, conAcceso } from "./reducerAutenticacion/AutenticacionSlice";
import { setRol, setNombreUsuario, setDatosProf } from "./reducerAutenticacion/UsuarioSlice";

import ajax from "../ConfigAxios";
import urlAjax from '../propiedades.json';
import { Alertas } from "./Alertas";

import '../css/login.css';

let Login = function ()
{
    const despacha = useDispatch();
    const url = useNavigate();

    const alertasComponent = Alertas();

    const [verContra, setVerContra] = useState(false);
    const [usuari, setUsuario] = useState("");
    const [constrasen, setConstrasena] = useState("");

    let cambiarUser= (e) => setUsuario(e.target.value);
    let cambiarContra= (e) => setConstrasena(e.target.value);
    let cambioVisulizacionContra = () => setVerContra(!verContra);

    let ajaxInicio = async () => {
        try{
            let peticion = await ajax.post(urlAjax.LOGIN, {usuario:usuari, contrasena:constrasen});
            let datos = await peticion.data;

            sessionStorage.setItem("Authorization", "Bearer "+datos.token);

            let pet = await ajax.post(urlAjax.DATOS_LOGIN, {usuario:usuari, contrasena:""});
            let dat = await pet.data;
            let roles = JSON.parse(datos.rol);

            despacha(setRol( roles[0].role ));
            despacha(setNombreUsuario(usuari));
            despacha(setDatosProf(dat.respuesta));

            if (peticion.status !== 200)
                despacha(sinAcceso());
            else if (roles[0].role === "ROLE_ADMIN")
            {
                despacha(conAcceso({ val: "1" , token: datos.token }));
                url("/menu-administrador/cargaDatProf");
            }
            else if (roles[0].role.length > 0)
            {
                despacha(conAcceso({ val: "2" , token: datos.token }));
                url("/menu-usuario/reposicion");
            }
            else
            {
                despacha(sinAcceso());
                url("/");
            }
            
        } catch (error) {
            await alertasComponent.crearModalAlerta({
                titulo: "Error",
                leyenda: "Credenciales erróneas.",
                icono: 2,
                activaCancelacion: false,
                TextoConfirmacion: "Cerrar",
                textoCancelacion: "",
                colorCancelar: "",
                activa: true,
                colorConfirmar: "#d32f2f"
            });
            despacha(sinAcceso());
            url("/");
        }
    };

    return(
        <Grid container sx={{marginTop:"10vh"}} >
            <Grid item xs={12} >
                <Card>
                    <CardContent sx={{backgroundColor:"black", textAlign:"center"}}>
                        <Typography variant="h3" component="span" sx={{color:"white"}}>
                            <DomainIcon sx={{fontSize:"50px"}} />
                            Departamento de Ciencias e Ingenier&iacute;a de la Computaci&oacute;n
                        </Typography>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent sx={{textAlign:"center"}}>
                        <Typography variant="h4" component="span" >
                            Iniciar sesi&oacute;n
                        </Typography>
                        <FormControl sx={{width:1}} variant="filled">
                            <InputLabel htmlFor="filled-adornment-password" 
                                style={{fontSize:"1.5em"}} >
                                Usuario
                            </InputLabel>
                            <FilledInput
                                type={'text'}
                                onChange={cambiarUser}
                                style={{fontSize:"1.5em"}}
                            />
                        </FormControl>
                        <FormControl sx={{width:1, mt:1}} variant="filled">
                            <InputLabel htmlFor="filled-adornment-password" 
                                style={{fontSize:"1.5em"}} >
                                Contraseña
                            </InputLabel>
                            <FilledInput
                                id="filled-adornment-password"
                                type={verContra ? 'text' : 'password'}
                                onChange={cambiarContra}
                                style={{fontSize:"1.5em"}}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onMouseDown={cambioVisulizacionContra}
                                    onMouseUp={cambioVisulizacionContra}
                                    edge="end"
                                    >
                                    {verContra ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </FormControl>
                    </CardContent>
                    <CardActions sx={{justifyContent:"center"}}>
                        <Button variant="contained" color="success" sx={{width:1/6}} onClick={ajaxInicio}>
                            <Typography fontSize={20}>
                                Entrar
                            </Typography>
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Login;