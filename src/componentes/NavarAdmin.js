import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Typography from "@mui/material/Typography";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

import 'bootstrap-icons/font/bootstrap-icons.css';

import Logout from "./Logout";

import '../css/menuusuario.css';

let NavarAdmin = ({nav}) => {

    const navegar = useNavigate();

    const [estiloNavar, setEstiloNavar] = useState([]);
    const [nombreAdmin, setNombreAdmin] = useState("");

    let cambiarPagina = (num) => {
        switch(num)
        {
            case 1:
                navegar("/menu-administrador/cargaDatProf");
                setEstiloNavar([true, false, false, false, false]);
                break;
            case 2:
                navegar("/menu-administrador/parametros");
                setEstiloNavar([false, true, false, false, false]);
                break;
            case 3:
                navegar("/menu-administrador/reposicion");
                setEstiloNavar([false, false, true, false, false]);
                break;
            case 4:
                navegar("/menu-administrador/corrimiento");
                setEstiloNavar([false, false, false, true, false]);
                break;
            case 5:
                navegar("/menu-administrador/economico");
                setEstiloNavar([false, false, false, false, true]);
                break;
            case 6:
                navegar("/menu-administrador/inciencias");
                setEstiloNavar([false, false, false, false, false, true, false]);
                break;
            case 7:
                navegar("/menu-administrador/incidenciasEconomicos");
                setEstiloNavar([false, false, false, false, false, false, true]);
                break;
                    
        }
    };

    useEffect( () => {

        let datos = JSON.parse(sessionStorage.getItem("datosProf"));

        setNombreAdmin(datos[0].nombreProf);

        switch(nav)
        {
            case 1:
                setEstiloNavar([true, false, false, false, false, false, false]);
                break;
            case 2:
                setEstiloNavar([false, true, false, false, false, false, false]);
                break;
            case 3:
                setEstiloNavar([false, false, true, false, false, false, false]);
                break;
            case 4:
                setEstiloNavar([false, false, false, true, false, false, false]);
                break;
            case 5:
                setEstiloNavar([false, false, false, false, true, false, false]);
                break;
            case 6:
                setEstiloNavar([false, false, false, false, false, true, false]);
                break;
            case 7:
                setEstiloNavar([false, false, false, false, false, false, true]);
                break;
        }
    }, [] );

    return(
        <>
            <Typography component={"p"} variant="h4" sx={{color:"white", textAlign:"center"}}>
                Departamento CIC Administrador
            </Typography>
            <Typography component={"p"} variant="h5" sx={{color:"white", textAlign:"center"}}>
                { nombreAdmin }
            </Typography>
            <MenuList>
                <MenuItem onClick={ () => cambiarPagina(1) }>
                    <div className={ estiloNavar[0] ? "navbar-usuario": "" }>
                        <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                            Carga datos de profesor
                        </Typography>
                    </div>
                </MenuItem>
                <MenuItem onClick={ () => cambiarPagina(2) }>
                    <div className={ estiloNavar[1] ? "navbar-usuario": "" }>
                        <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                            Parámetros
                        </Typography>
                    </div>
                </MenuItem>
                <MenuItem onClick={ () => cambiarPagina(3) }>
                    <div className={ estiloNavar[2] ? "navbar-usuario": "" }>
                        <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                            Crear reposici&oacute;n
                        </Typography>
                    </div>
                </MenuItem>
                <MenuItem onClick={ () => cambiarPagina(4) }>
                    <div className={ estiloNavar[3] ? "navbar-usuario": "" }>
                        <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                            Crear corrimiento
                        </Typography>
                    </div>
                </MenuItem>
                <MenuItem onClick={ () => cambiarPagina(5) }>
                    <div className={ estiloNavar[4] ? "navbar-usuario": "" }>
                        <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                            Crear día económico
                        </Typography>
                    </div>
                </MenuItem>
                <MenuItem onClick={ () => cambiarPagina(6) }>
                    <div className={ estiloNavar[5] ? "navbar-usuario": "" }>
                        <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                            Incidencias
                        </Typography>
                    </div>
                </MenuItem>
                <MenuItem onClick={ () => cambiarPagina(7) }>
                    <div className={ estiloNavar[6] ? "navbar-usuario": "" }>
                        <Typography component={"p"} variant="h6" sx={{color:"white", textAlign:"center"}}>
                            Días económicos.
                        </Typography>
                    </div>
                </MenuItem>
            </MenuList>
            <Logout/>
        </>
    )
};

export default NavarAdmin;