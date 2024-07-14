import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

import Typography from "@mui/material/Typography";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

import 'bootstrap-icons/font/bootstrap-icons.css';

import Logout from "./Logout";
import { recargarDatos } from "./reducerAutenticacion/UsuarioSlice";

import '../css/menuusuario.css';
import AgregarDatosFaltan from "./AgregarDatosFaltan";

let NavarUsuario = ({nav}) => {

    const navegar = useNavigate();
    
    const despacha = useDispatch();

    const [nombreProfesor, setNombreProfesor] = useState("");
    const [estiloNavar, setEstiloNavar] = useState([]);

    let cambiarPagina = (num) => {
        switch(num)
        {
            case 1:
                navegar("/menu-usuario/reposicion");
                setEstiloNavar([true, false, false, false]);
                break;
            case 2:
                navegar("/menu-usuario/corrimiento");
                setEstiloNavar([false, true, false, false]);
                break;
            case 3:
                navegar("/menu-usuario/economico");
                setEstiloNavar([false, false, true, false]);
                break;
            case 4:
                navegar("/menu-usuario/horario");
                setEstiloNavar([false, false, false, true]);
                break;
        }
    };

    useEffect( () => {
        let dat = JSON.parse(sessionStorage.getItem("datosProf"));
        despacha( recargarDatos() );
        setNombreProfesor(dat[0].nombreProf);
        switch(nav)
        {
            case 1:
                setEstiloNavar([true, false, false, false]);
                break;
            case 2:
                setEstiloNavar([false, true, false, false]);
                break;
            case 3:
                setEstiloNavar([false, false, true, false]);
                break;
            case 4:
                setEstiloNavar([false, false, false, true]);
                break;
        }
    }, [] );

    return(
        <>
            <AgregarDatosFaltan />
            <Typography component={"p"} variant="h4" sx={{color:"white", textAlign:"center"}}>Departamento CIC</Typography>
            <Typography component={"p"} variant="h5" sx={{color:"white", textAlign:"center"}}>{"Bienvenido "+nombreProfesor}</Typography>
            <MenuList>
                <MenuItem onClick={ () => cambiarPagina(1) }>
                    <div className={ estiloNavar[0] ? "navbar-usuario": "" }>
                        <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                            Reposici&oacute;n de horas
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
                            Día económico
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
        </>
    )
};

export default NavarUsuario;