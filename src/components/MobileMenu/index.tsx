import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useResponse } from '../../hooks/useResponse';
import { handleDynamicPagesByRule, handleIconMenu } from '../../config/menu';

import { Container } from './style';
import { StyledMenu } from '../DesktopMenu/style';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { Alert } from '@mui/material';

import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { QRCodeReader, QRCodeScanner } from '../qrCodeScanner';


type Anchor = 'top' | 'left' | 'bottom' | 'right';

export function MobileDrawerMenu() {
    const navigate = useNavigate();
    const {response, severityStatus, responseMassage} = useResponse();
    const { setUser } = useAuth();

    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = 
        (anchor: Anchor, open: boolean) => 
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
            ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const handlePageChange = (text: string) => {
        navigate(`/${text}`);
    }

    const handleLogout = () => {
		localStorage.removeItem('Authorization');
		setUser(undefined);
		navigate('/login');
	};

    const [qrCode, setQRCode] = useState<string | null>(null);
    const [showScanner, setShowScanner] = useState<boolean>(false);

    const handleScanSuccess = (decodedText: string) => {
        setQRCode(decodedText);  // Atualiza o estado com o valor do QR Code lido
        console.log("QR Code lido:", decodedText);
    };

      const handleScanError = (error: any) => {
        console.error("Erro ao ler QR Code:", error);
    };

    const startScanner = () => {
        setShowScanner(true);  // Exibe o scanner quando o botão for clicado
    };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {handleDynamicPagesByRule.map((area, index) => (
                    <div key={index}>
                        <StyledMenu>{area.name}</StyledMenu>
                        <List>
                            {area.pages.map((page, pageIndex) => (
                                <ListItem key={pageIndex} disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton
                                        onClick={() => { handlePageChange(Object.keys(page)[0]); }}
                                        sx={{
                                            minHeight: 48,
                                            px: 2.5,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {handleIconMenu(Object.keys(page)[0])}
                                        </ListItemIcon>
                                        <ListItemText primary={Object.values(page)[0]} sx={{ padding: '1rem' }}/>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                  </div>
                ))}
            </List>
        </Box>
    );

    return (
        <Container className='flex'>
            <header className='flex'>
                <nav className='flex'>
                    {(['bottom'] as const).map((anchor) => (
                        <React.Fragment key={anchor}>
                            <Button
                                className='menu' 
                                onClick={toggleDrawer('bottom', true)}
                            >
                                <MenuOutlinedIcon />
                            </Button>
                            <Drawer
                                anchor={anchor}
                                open={state[anchor]}
                                onClose={toggleDrawer(anchor, false)}
                            >
                                {list(anchor)}
                            </Drawer>
                        </React.Fragment>
                    ))}
                </nav>
                <div className="flex">
                    <Button
                        className='logout' 
                        onClick={startScanner}
                    >
                        <QrCodeScannerIcon />
                    </Button>
                </div>
                <div className="flex">
                    <Button
                        className='logout' 
                        onClick={handleLogout}
                    >
                        <LogoutIcon />
                    </Button>
                </div>
            </header>
            <Outlet/>
            {
                showScanner && (
                    <QRCodeScanner
                        onScanSuccess={handleScanSuccess} 
                        onScanError={handleScanError} 
                    />
                )
            }
            {qrCode && <p>QR Code lido: {qrCode}</p>}
            {
                response ? 
                    <Alert severity={severityStatus} className="alert">{responseMassage}</Alert>
                    : <></>
            }
        </Container>
    );
}
