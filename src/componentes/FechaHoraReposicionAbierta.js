import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from "@mui/material/TextField";
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Grid from "@mui/material/Grid";
import 'dayjs/locale/en-gb';

let FechaHoraReposicionAbierta = ({setFecha, setHoraInicio, setHoraFinal, setHorasCubre, horaCubre, indice}) => {
    const EstiloTimePicker = {
        width: '98%!important',
    };

    return(
        <>
            <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb" >
                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                        <DatePicker 
                            sx={EstiloTimePicker} 
                            label="Fecha incidencia"
                            onChange={(event) => setFecha(event, indice)} />
                    </DemoContainer>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                        <TimePicker
                        onChange={(event) => setHoraInicio(event, indice)}
                        sx={EstiloTimePicker}
                        label="Hora checada inicio"
                        ampm={false}
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker', 'TimePicker']}>
                        <TimePicker
                        onChange={(event) => setHoraFinal(event, indice)}
                        sx={EstiloTimePicker}
                        label="Hora checada fin"
                        ampm={false}
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={3}>
                <TextField
                onChange={ (event) => setHorasCubre(event, indice) }
                className='elemetsFormulario'
                multiline
                variant="filled"
                label="Horas cubre"
                placeholder="Horas cubre" />
            </Grid>
        </>
    );
};

export default FechaHoraReposicionAbierta;