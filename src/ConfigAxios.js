import axios from 'axios';
import propiedades from './propiedades.json';
import { Alertas } from './componentes/Alertas';

const alertasComponent = Alertas();

let ajax = axios.create({
  baseURL: propiedades.URL_SERVER,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

ajax.interceptors.request.use( pet => {

    pet.headers["Authorization"] = sessionStorage.getItem("Authorization")
    return pet;
  
  }, error => {
    return Promise.reject(error);
  } );

ajax.interceptors.response.use( respuesta => {
  return respuesta;
}, async error => {

  if( error.response.status == 403 )
  {
    await alertasComponent.crearModalAlerta({
      titulo: "Sesión expirada.",
      leyenda: "Su sesión ha expirado. Favor de iniciar sesión de nuevo.",
      icono: 4,
      activaCancelacion: false,
      TextoConfirmacion: "Cerrar",
      textoCancelacion: "",
      colorCancelar: "",
      activa: true,
      colorConfirmar: "#d32f2f"
    });

    sessionStorage.clear();
    window.location.href = '/';
  }

  return Promise.reject(error);
} );

export default ajax;
