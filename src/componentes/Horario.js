import { useEffect } from "react";
import { useSelector } from "react-redux";

import Grid  from "@mui/material/Grid";
import Card  from "@mui/material/Card";
import Typography  from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import NavarUsuario from "./NavarUsuario";
import '../css/horario.css';

let Horario = () => {
    const estilosCard = {
        backgroundColor: "rgba(255, 255, 255, 0.706)",
        borderStyle: "solid",
        borderColor: "black",
        marginTop: "0.7%",
        marginLeft: "0.7%",
    };
    const EstiloTimePicker = {
        width: '98%!important',
    };
    const datos = useSelector( state => state.usuario );
    let index = 0;

    useEffect( () => {
        index = 0;
    }, [] );

    return(

        <Grid container>
            <Grid item xs={3} 
                sx={{height:"98vh", backgroundColor:"rgba(0, 0, 0, 0.85)"}} >
                <NavarUsuario nav={4} />
            </Grid>
            <Grid item xs={9} sx={{maxHeight:"98vh", overflow:"scroll"}}>
                <Card sx={estilosCard}>
                    <Typography component={"p"} variant='h4' sx={{textAlign:"center"}}>
                        Horario de profesor
                    </Typography>
                    <CardContent sx={{overflow: "scroll!important"}}>
                        <Grid container>
                            <Grid item xs={4}>
                                {
                                    datos.datosProf.map( (iterador) => (
                                        <div index={++index} className="sepa-ren">
                                            <TextField
                                            sx={EstiloTimePicker}
                                            multiline
                                            variant="filled"
                                            label="Dia"
                                            placeholder="Dia"
                                            value={iterador.nombreDia} />
                                        </div>
                                    ) )
                                }
                            </Grid>
                            <Grid item xs={4}>
                            {
                                    datos.datosProf.map( (iterador) => (
                                        <div index={++index} className="sepa-ren">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['TimePicker']}>
                                                    <TimePicker
                                                        sx={EstiloTimePicker}
                                                        label="Hora entrada"
                                                        defaultValue={new Date('1970-01-01 '+iterador.horaEntrada)}
                                                        viewRenderers={{
                                                            hours: renderTimeViewClock,
                                                            minutes: renderTimeViewClock,
                                                            seconds: renderTimeViewClock,
                                                            }}
                                                        />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                    ) )
                                }
                            </Grid>
                            <Grid item xs={4}>
                            {
                                    datos.datosProf.map( (iterador) => (
                                        <div index={++index} className="sepa-ren">
                                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                <DemoContainer components={['TimePicker']} >
                                                    <TimePicker
                                                        sx={EstiloTimePicker}
                                                        label="Hora salida"
                                                        defaultValue={new Date('1970-01-01 '+iterador.horaSalida)}
                                                        viewRenderers={{
                                                            hours: renderTimeViewClock,
                                                            minutes: renderTimeViewClock,
                                                            seconds: renderTimeViewClock,
                                                            }}
                                                        />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                    ) )
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Horario;