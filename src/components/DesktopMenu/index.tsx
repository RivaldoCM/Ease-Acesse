import _React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { handleIconMenu } from '../../config/menu';

import { StyledMenu, TopStyled } from './style';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import { Alert } from '@mui/material';
import { useResponse } from '../../hooks/useResponse';
import { IconAcesse } from '../SVG/acesseLogo';

const drawerWidth = 320;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'block',
	padding: theme.spacing(0, 1, 0, 0),
	zIndex: 999,
	top: 0,
	position: 'sticky',
	backgroundColor: '#fff',
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
	})<AppBarProps>(({ theme, open }) => ({
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		...(open && {
			marginLeft: drawerWidth,
			width: `calc(100% - ${drawerWidth}px)`,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  	({ theme, open }) => ({
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
		boxSizing: 'border-box',
		...(open && {
			...openedMixin(theme),
			'& .MuiDrawer-paper': openedMixin(theme),
		}),
		...(!open && {
			...closedMixin(theme),
			'& .MuiDrawer-paper': closedMixin(theme),
		}),
	}),
);

export function MenuDrawer() {
	const pages: any = localStorage.getItem('Pages');

	const navigate = useNavigate();
	const { user, setUser } = useAuth();
	const {response, severityStatus, responseMassage} = useResponse();
	const theme = useTheme();

	const [ open, setOpen ] = useState(false);
	const [ currentPage, setCurrentPage ] = useState('EASE ACESSE');

	const handleDrawerOpen = () => { setOpen(true);	};
	const handleDrawerClose = () => { setOpen(false); };
	const redirectToRoute = (text: string) => {	navigate(`${text.toLocaleLowerCase()}`); }
	const handlePageChange = (route: string, page: string) => { 
		redirectToRoute(route);	
		setCurrentPage(page);
	};

	const handleLogout = () => {
		localStorage.removeItem('Authorization');
		setUser(undefined);
		navigate('/login');
	};

	return(
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar 
				className='flex' 
				position="fixed" 
				open={open}
				sx={{
					flexDirection: 'row-reverse',
				}}
			>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					onClick={handleLogout}
					edge="start"
					sx={{
						marginRight: 5,
						zIndex: 5
					}}
				>
					<LogoutIcon />
				</IconButton>
				<Toolbar sx={{width: '100% !important',}}>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{
							marginRight: 5,
							...(open && { display: 'none' }),
						}}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						{currentPage}
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={open}>
				<DrawerHeader>
					<TopStyled>
						<div>
							<IconAcesse />
						</div>
						<IconButton onClick={handleDrawerClose}>
							{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
						</IconButton>
					</TopStyled>
					<Divider sx={{width:'100%'}}/>
				</DrawerHeader>
				<List>
					{user && JSON.parse(pages).map((collection: any, index: number) => {
						return(
							<div key={index}>
								{ open && <StyledMenu className='selection-menu'>{collection.category}</StyledMenu> }
								<List>
									{collection.pages.map((page: any, index: number) => {
										return(
											<ListItem key={index} disablePadding sx={{ display: 'block' }}>
												<ListItemButton
													onClick={() => {handlePageChange(page.path, page.name)}}
													sx={{ minHeight: 48, px: 2.5 }}
												>
													<ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}
													>
														{handleIconMenu(page.path)}
													</ListItemIcon>
													<ListItemText primary={page.name} sx={{ padding: '.5rem 1.5rem' }}/>
												</ListItemButton>
											</ListItem>
										)
									})}
								</List>
							</div>
						)
					})}
				</List>
			</Drawer>
			<Box component="main" className='flex' sx={{ flexGrow: 1, mt: '68px' }}>
				<Outlet />
				{
                response ? 
                	<Alert severity={severityStatus} className="alert">{responseMassage}</Alert>
                	: <></>
            	}
			</Box>
		</Box>
	);
}
