import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import 'bootstrap-icons/font/bootstrap-icons.css';

import { recargarDatos } from "./reducerAutenticacion/UsuarioSlice";
import Logout from "./Logout";
import Reposicion from "./Reposicion";
import Corrimiento from "./Corrimiento";
import DiaEconomico from "./DiaEconomico";
import Horario from "./Horario";

import '../css/menuusuario.css';
import AgregarDatosFaltan from "./AgregarDatosFaltan";

let MenuUsuario = function (){
      
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
    
    const despacha = useDispatch();
    let datos = useSelector( state => state.usuario );

    const [nombreProfesor, setNombreProfesor] = useState("");
    const [estiloNavar, setEstiloNavar] = useState([true, false, false, false]);
    const [tarjetaCic, setTarjetaCic] = useState("");
    const [alertaSimple, setAlertaSimple] = 
        useState({
                    msm: "",
                    activa: false,
                    icono: 0
                });

    /*let cambiarMsm = (obj) => {
        setAlertaSimple(obj);
    };*/

    const [tipoInc, setTipoInc] =  useState(<Reposicion />);

    let cambiarPagina = (num) => {
        switch(num)
        {
            case 1:
                setTipoInc(<Reposicion />);
                setEstiloNavar([true, false, false, false]);
                break;
            case 2:
                setTipoInc(<Corrimiento />);
                setEstiloNavar([false, true, false, false]);
                break;
            case 3:
                setTipoInc(<DiaEconomico />);
                setEstiloNavar([false, false, true, false]);
                break;
            case 4:
                setTipoInc(<Horario/>);
                setEstiloNavar([false, false, false, true]);
                break;
        }
    };

    useEffect( () => {
        let dat = JSON.parse(sessionStorage.getItem("datosProf"));
        despacha( recargarDatos() );
        setNombreProfesor(dat[0].nombreProf);
        setTarjetaCic(dat[0].tarjetaCic);
    }, [] );

    let revisaDatosObligatorios = async () => {
        try {
            
        } catch (error) {}
    };

    return(
        <>
            <AgregarDatosFaltan />
            <Grid container>
                <Grid item xs={3} 
                    sx={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}} >
                    <Typography component={"p"} variant="h4" sx={{color:"white", textAlign:"center"}}>Departamento CIC</Typography>
                    <Typography component={"p"} variant="h5" sx={{color:"white", textAlign:"center"}}>{"Bienvenido "+nombreProfesor}</Typography>
                    <MenuList>
                        <MenuItem onClick={ () => cambiarPagina(1) }>
                            <div className={ estiloNavar[0] ? "navbar-usuario": "" }>
                                <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                                    Reposicion de horas
                                </Typography>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={ () => cambiarPagina(2) }>
                            <div className={ estiloNavar[1] ? "navbar-usuario": "" }>
                                <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                                    Corrimiento de horario
                                </Typography>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={ () => cambiarPagina(3) }>
                            <div className={ estiloNavar[2] ? "navbar-usuario": "" }>
                                <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                                    Dia economico
                                </Typography>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={ () => cambiarPagina(4) }>
                            <div className={ estiloNavar[3] ? "navbar-usuario": "" }>
                                <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                                    Ver horario.
                                </Typography>
                            </div>
                        </MenuItem>
                    </MenuList>
                    <Logout/>
                </Grid>
                <Grid item xs={9} sx={{maxHeight:"98vh", overflow:"scroll"}}>
                    <Card sx={estilosCard}>
                        <Typography component={"p"} variant='h4' sx={{textAlign:"center"}}>
                            Datos profesor
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
                                        />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    {   tipoInc   }
                </Grid>
            </Grid>
        </>
    );
};

export default MenuUsuario;