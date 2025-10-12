import { Box, Typography } from "@mui/material";

import PageNotFound404 from '../../assets/SVG/pageNotFound.svg?react'

export function PageNotFound(){
    return(
        <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            height="100%"
        >
            <PageNotFound404 style={{ width: '50%', height: '50%' }} />
            <Typography variant="h5" color="textSecondary">
                Nenhum massiva aberto. AMÉM?
            </Typography>
        </Box>
    )
}