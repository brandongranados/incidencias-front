import { createSlice } from "@reduxjs/toolkit";

export const Usuario = createSlice({
    name: "DatosUsuario",
    initialState:{
        rol: "",
        nombreUsuario: "",
        datosProf:[]
    },
    reducers:{
        setRol : (state,action) => {
            state.rol = action.payload;
            sessionStorage.setItem("rol", action.payload);
        },
        setNombreUsuario : (state,action) => {
            state.nombreUsuario = action.payload;
            sessionStorage.setItem("nombreUsuario", action.payload);
        },
        setDatosProf : (state,action) => {
            state.datosProf = action.payload;
            sessionStorage.setItem("datosProf", JSON.stringify(action.payload));
        },
        recargarDatos : (state, action) => {
            state.rol = sessionStorage.getItem("rol");
            state.nombreUsuario = sessionStorage.getItem("nombreUsuario");
            try {
                state.datosProf = JSON.parse(sessionStorage.getItem("datosProf"));
            } catch (error) {
                state.datosProf = "";
            }
        }
    }
});

export const {
    setRol,
    setNombreUsuario,
    setDatosProf,
    recargarDatos
} = Usuario.actions;