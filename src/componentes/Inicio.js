import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { revisaAcceso } from "./reducerAutenticacion/AutenticacionSlice";
import { Store } from './reducerAutenticacion/Store';

import Login from './Login';
import Parametros from "./Parametros";
import IncidenciasEconomico from "./IncidenciasEconomico";
import DatosProfesor from "./DatosProfesor";
import Inciencias from "./Incidencias";
import MenuUsuario from "./MenuUsuario";

let Inicio = () => {
    const despacha = useDispatch();

    useEffect( () => {
        despacha( revisaAcceso() );
    }, [] );

    return(
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/menu-administrador/cargaDatProf" element={<DatosProfesor/>} />
            <Route path="/menu-administrador/inciencias" element={<Inciencias />} />
            <Route path="/menu-administrador/parametros" element={<Parametros />}/>
            <Route path="/menu-administrador/incidenciasEconomicos" element={<IncidenciasEconomico />}/>
            <Route path="/menu-usuario" element={<MenuUsuario />}/>
        </Routes>
    )
};

let App = function (){
    return(
        <Provider store={Store}>
            <BrowserRouter>
                <Inicio/>
            </BrowserRouter>
        </Provider>
    );
};

export {App};