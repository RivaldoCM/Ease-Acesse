import { Box, Button, Typography } from "@mui/material";

import PageNotFound404 from '../../assets/SVG/pageNotFound.svg?react'
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function PageNotFound(){
    const navigate = useNavigate();

    return(
        <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center"
            justifyContent="center" 
            height="100vh"
        >
            <PageNotFound404 style={{ width: '50%', height: '50%' }} />
            <Typography variant="h5" color="textSecondary" className='flex' style={{ marginTop:'1rem', flexDirection:'column' }}>
                <p>Você está tentando acessar uma página que não existe.</p>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => {navigate(localStorage.getItem("initialPage")!)}}
                >
                    Retornar ao site
                </Button>
            </Typography>
        </Box>
    )
}