import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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

import '../css/login.css';

let Login = function ()
{
    const despacha = useDispatch();
    const url = useNavigate();

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
            let token = datos.token;
            let pet = await ajax.post(urlAjax.DATOS_LOGIN, {usuario:usuari, contrasena:""},
            {headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
              }});
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
                        <form>
                            <TextField
                                sx={{width:"100%", marginTop:"2%"}}
                                label="Usuario"
                                placeholder="Usuario"
                                multiline
                                variant="filled"
                                onChange={cambiarUser}
                                inputProps={{style:{fontSize:"1.5em", height:"1.5em"}}}
                                InputLabelProps={{style:{fontSize:"1.5em"}}} />
                            <FormControl sx={{width:"100%"}} variant="filled">
                                <InputLabel htmlFor="filled-adornment-password" style={{fontSize:"1.5em"}} >
                                    Contrasena
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
                        </form>
                    </CardContent>
                    <CardActions sx={{justifyContent:"center"}}>
                        <Button variant="contained" color="success" sx={{width:"15%", fontSize:"1.5em"}} onClick={ajaxInicio}>
                            Entrar
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Login;