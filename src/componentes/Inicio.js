import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

import { revisaAcceso } from "./reducerAutenticacion/AutenticacionSlice";
import { Store } from './reducerAutenticacion/Store';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MenuAdministrador from './MenuAdministrador';
import MenuUsuario from './MenuUsuario';
import Login from './Login';

let Inicio = () => {
    const despacha = useDispatch();

    useEffect( () => {
        despacha( revisaAcceso() );
    }, [] );

    return(
        <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/menu-administrador" element={<MenuAdministrador pag={1} />} />
            <Route path="/menu-administrador/cargaDatProf" element={<MenuAdministrador pag={1} />} />
            <Route path="/menu-administrador/inciencias" element={<MenuAdministrador pag={2} />} />
            <Route path="/menu-administrador/parametros" element={<MenuAdministrador pag={0} />}/>

            <Route path="/menu-usuario" element={<MenuUsuario />} />
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