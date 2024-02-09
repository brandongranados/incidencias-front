import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Grid from "@mui/material/Grid";

let FechaHoraReposicion = ({setFecha, setHoraInicio, setHoraFinal, indice}) => {
    const EstiloTimePicker = {
        width: '98%!important',
    };

    return(
        <>
            <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                        <DatePicker 
                            sx={EstiloTimePicker} 
                            label="Fecha incidencia"
                            onChange={(event) => setFecha(event, indice)} />
                    </DemoContainer>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                        <TimePicker
                        onChange={(event) => setHoraInicio(event, indice)}
                        sx={EstiloTimePicker}
                        label="Hora checada inicio"
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                        <TimePicker
                        onChange={(event) => setHoraFinal(event, indice)}
                        sx={EstiloTimePicker}
                        label="Hora checada fin"
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </Grid>
        </>
    );
};

export default FechaHoraReposicion;