import { createSlice } from "@reduxjs/toolkit";

export const Incidencia = createSlice({
    name: "DatosInicidencia",
    initialState:{
        fecha: "",
        horaIni: "",
        horaFin: "",
        observaciones:"",
        reposicion: []
    },
    reducers:{
        setFecha: (state, payload) => state.fecha = payload.fechaInc,
        setHoraIni: (state, payload) => state.horaIni = payload.horaIniInc,
        setHoraFin: (state, payload) => state.horaFin = payload.horaFinInc,
        setObservaciones: (state, payload) => state.observaciones = payload.observaciones,
        setReposicion: (state, payload) => state.reposicion = payload.reposicion
    }
});

export const {
    setFecha,
    setHoraIni,
    setHoraFin,
    setObservaciones,
    setReposicion
} = Incidencia.actions;