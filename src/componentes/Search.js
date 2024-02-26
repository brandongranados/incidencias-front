import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';

import '../css/Search.css';

let Search = ({ value, onChange }) => {
    const SearchDefinido = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'inherit',
        '&:hover': {
            backgroundColor: 'inherit',
        },
        borderStyle:'solid',
        borderWidth:'0.15em',
        borderColor: 'black',
        marginLeft: 0,
        marginTop: '6px',
        fontSize: '',
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(1),
          width: 'auto',
        },
    }));
      
    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));
      
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        height:'51px',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
        },
    }));

    return(
        <SearchDefinido>
            <SearchIconWrapper>
            <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Buscar"
                inputProps={{ 'aria-label': 'search' }}
                value={value}
                onChange={onChange}
                autoFocus
            />
        </SearchDefinido>
    );

};

export default Search;