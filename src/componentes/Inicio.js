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
import ReposicionAbierta from "./ReposicionAbierta";
import Reposicion from "./Reposicion";
import Corrimiento from "./Corrimiento";
import DiaEconomico from "./DiaEconomico";
import Horario from "./Horario";
import CorrimientoAbierto from "./CorrimientoAbierto";
import DiaEconomicoAbierto from "./DiaEconomicoAbierto";

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
            <Route path="/menu-administrador/reposicion" element={<ReposicionAbierta/>}/>
            <Route path="/menu-administrador/corrimiento" element={<CorrimientoAbierto/>}/>
            <Route path="/menu-administrador/economico" element={<DiaEconomicoAbierto/>}/>

            <Route path="/menu-usuario/reposicion" element={<Reposicion />}/>
            <Route path="/menu-usuario/corrimiento" element={<Corrimiento />}/>
            <Route path="/menu-usuario/economico" element={<DiaEconomico />}/>
            <Route path="/menu-usuario/horario" element={<Horario />}/>
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