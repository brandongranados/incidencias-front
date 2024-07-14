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

export { Alertas };