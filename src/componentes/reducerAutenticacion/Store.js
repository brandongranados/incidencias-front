import { configureStore } from "@reduxjs/toolkit";
import { Autenticacion } from "./AutenticacionSlice";
import { Usuario } from "./UsuarioSlice";

export const Store = configureStore({
    reducer: {
        autenticacion: Autenticacion.reducer,
        usuario: Usuario.reducer
    }
});