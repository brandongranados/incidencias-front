import { AlertTitle } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import '../css/generico.css';

let Alertas = () => {
    let crearModalAlerta = async (obj) => {
        let icono = null;

        switch( obj.icono )
        {
            case 1:
                icono ="success";
            break;
            case 2:
                icono ="error";
            break;
            case 3:
                icono ="warning";
            break;
            case 4:
                icono ="info";
            break;
            case 5:
                icono ="question";
            break;
            default:
                icono ="success";
            break;
        }

        let alerta = 
        await 
            Swal.fire({
                title: obj.titulo,
                text: obj.leyenda,
                icon: icono,
                showCancelButton: obj.activaCancelacion,
                confirmButtonText: obj.TextoConfirmacion,
                cancelButtonText: obj.textoCancelacion,
                cancelButtonColor: obj.colorCancelar,
                confirmButtonColor: obj.colorConfirmar
            });
        return alerta.isConfirmed;
    };

    return { crearModalAlerta };
};

let Simples = ({obj}) => {
    const [icono, setIcono] = useState("success");

    useEffect( () => {
        switch( obj.icono )
        {
            case 1:
                setIcono("success");
            break;
            case 2:
                setIcono("info");
            break;
            case 3:
                setIcono("warning");
            break;
            case 4:
                setIcono("error");
            break;
            default:
                setIcono("success");
            break;
        }

        if( !obj.activa )
            setTimeout( () => {}, 5000 );

    }, [obj] );

    return obj.activa ? 
    (
        <Alert severity={icono} className="fade-in-out">
            <AlertTitle>{obj.titulo}</AlertTitle>
            {obj.msm}
        </Alert>
    ) : (
        <></>
    );

};

export { Alertas, Simples };