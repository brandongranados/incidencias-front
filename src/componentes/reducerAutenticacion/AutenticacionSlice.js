import { createSlice } from "@reduxjs/toolkit";

let cambiarSesion = (ses, token) => {
    sessionStorage.setItem("sesionCIC", ses);
    sessionStorage.setItem("Authorization", (token.length == 0 ? "" : "Bearer "+token));
};

export const Autenticacion = createSlice({
    name: "Autenticar",
    initialState: {
      rol: "/",
    },
    reducers: {
      conAcceso: (state, action) => {
        const { val, token } = action.payload;
        cambiarSesion(val, token);
        if (parseInt(val) == 1) 
          state.rol = "/menu-administrador";
        else if (parseInt(val) == 2)
          state.rol = "/menu-usuario";
        else
          state.rol = "/";
      },
      sinAcceso: (state) => {
        state.rol = "/";
        cambiarSesion("0", "");
        sessionStorage.clear();
      },
      revisaAcceso: (state) => {
        let sesion = parseInt(sessionStorage.getItem("sesionCIC"));
        let token = sessionStorage.getItem("Authorization");
        sesion = isNaN(sesion) ? 0 : sesion;
        token = token != null ? token.replace("Bearer", "").trim() : null;
  
        if (sesion == 1)
          state.rol = "/menu-administrador";
        else if (sesion == 2)
          state.rol = "/menu-usuario";
        else
          state.rol = "/";
      },
    },
  });
  
  export const 
{ conAcceso, 
    sinAcceso, 
    revisaAcceso, 
    intentarSesionLogin 
} = Autenticacion.actions;