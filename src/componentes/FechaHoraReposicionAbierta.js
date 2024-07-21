import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

let FechaHoraReposicionAbierta = ({setFecha, setHoraInicio, setHoraFinal, setHorasCubre, horaCubre, indice}) => {

    return(
        <>
            <Grid item xs={3} sx={{pt:1}}>
                <Box sx={{pr:1}}>
                    <TextField
                        sx={{width: 1}}
                        type="date"
                        placeholder="Fecha incidencia"
                        onChange={(event) => setFecha(event, indice)}
                        />
                </Box>
            </Grid>
            <Grid item xs={3} sx={{pt:1}}>
                <Box sx={{pr:1}}>
                    <TextField
                        sx={{width: 1}}
                        type="time"
                        placeholder="Hora checada inicio"
                        onChange={(event) => setHoraInicio(event, indice)}
                        />
                </Box>
            </Grid>
            <Grid item xs={3} sx={{pt:1}}>
                <Box sx={{pr:1}}>
                    <TextField
                        sx={{width: 1}}
                        type="time"
                        placeholder="Hora checada fin"
                        onChange={(event) => setHoraFinal(event, indice)}
                        />
                </Box>
            </Grid>
            <Grid item xs={3} sx={{pt:1}}>
                <Box sx={{pr:1}}>
                    <TextField
                    onChange={ (event) => setHorasCubre(event, indice) }
                    sx={{width:1}}
                    variant="filled"
                    label="Horas cubre"
                    placeholder="Horas cubre" />
                </Box>
            </Grid>
        </>
    );
};

export default FechaHoraReposicionAbierta;