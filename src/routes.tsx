import { ReactElement, useEffect, useState} from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { isLogged } from "./config/isLogged";

import { Login } from "./pages/Login";
import { Olts } from "./pages/admin/olts";
import { Users } from "./pages/admin/users";
import { OnuDelete } from "./pages/onuDelete";
import { LogsOnu } from "./pages/logs/onu";
import { AuthOnuController } from "./pages/Provisionamento";
import { MyAuthorizedOnus } from "./pages/MyAuthorizedOnus";

import { MenuDrawer } from "./components/DesktopMenu";
import { MobileDrawerMenu } from "./components/MobileMenu";

import { AuthOnuContextProvider } from "./contexts/AuthOnuContext";
import { MyAuthorizedOnusMobile } from "./pages/MyAuthorizedOnus/mobile";
import { BreakTime } from "./pages/breakTime/breakTime";
import { useSocket } from "./hooks/useSocket";
import { useAuth } from "./hooks/useAuth";
import { BreakTimePanel } from "./pages/breakTime/panel";
import { BreakTimeContextProvider } from "./contexts/BreakTimeContext";
import { BreakTimeDashboard } from "./pages/breakTime/dashboard";
import { Massive } from "./pages/massive";
import { LogsMassives } from "./pages/logs/massives";
import { MassiveContextProvider } from "./contexts/MassiveContext";
import { MassivePanel } from "./pages/massive/panel";
import { EditOlt } from "./pages/admin/olts/editOlt";
import { AddOlt } from "./pages/admin/olts/addOlt";

const PrivateRoute: React.FC<{element: ReactElement}> = ({ element }: {element: ReactElement}) => {
    return isLogged() ? element : <Navigate to='/login' />;
}

export function AppRoutes() {
    const { user } = useAuth(); 
    const { socket, rooms } = useSocket();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const [lastRoutes, setLastRoutes] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('Authorization');
        setLastRoutes(prevRoutes => [...prevRoutes, location.pathname]);

        rooms.map((room: string) => {
            if(lastRoutes.at(-1)?.includes(room) && !location.pathname.includes(room)){
                socket.emit("leave_room", {
                    uid: user?.uid,
                    room: lastRoutes.at(-1)
                });
            }
        });

        if(token && location.pathname === '/login' || token && location.pathname === '/'){
            if(user?.rule === 1 || user?.rule === 2){
                navigate('/break_time/breaks');
            } else if(user?.rule === 3){
                navigate('/break_time/dashboard');
            } else if(user?.rule === 10){
                navigate('/auth_onu');
            } else {
                navigate('/massive');
            }
        }
        
        if (!token && location.pathname !== '/login') {
            navigate('/login');
        }
    }, [location]);

    return (
        <Routes>
            <Route index path="login" element={<Login />} />
            <Route
                path="massive_panel"
                element={
                    <MassiveContextProvider>
                        <PrivateRoute element={ <MassivePanel /> }/>
                    </MassiveContextProvider>
                }
            />
            <Route path="" element={matches ? <MobileDrawerMenu /> : <MenuDrawer />}>
                <Route
                    path="olts"
                    element={<PrivateRoute element={<Olts />} />}
                />
                <Route
                    path="olts/:id"
                    element={<PrivateRoute element={<EditOlt />} />}
                />
                <Route
                    path="olts/new_olt"
                    element={<PrivateRoute element={<AddOlt />} />}
                />
                <Route
                    path="users"
                    element={<PrivateRoute element={<Users />} />}
                />
                <Route
                    path="onuDelete"
                    element={<PrivateRoute element={<OnuDelete />} />}
                />
                <Route
                    path="logs_onu"
                    element={<PrivateRoute element={<LogsOnu />} />}
                />
                <Route
                    path="auth_onu"
                    element={
                        <AuthOnuContextProvider>
                            <PrivateRoute
                                element={<AuthOnuController />}
                            />
                        </AuthOnuContextProvider>
                    }
                />
                <Route 
                    path="massive"
                    element={
                        <MassiveContextProvider>
                            <PrivateRoute element={ <Massive />}/>
                        </MassiveContextProvider>
                    }
                />
                <Route 
                    path="logs_massive"
                    element={
                        <PrivateRoute element={ <LogsMassives />}/>
                    }
                />
                <Route path="break_time">
                    <Route 
                        path="dashboard" 
                        element={
                            <BreakTimeContextProvider>
                                <PrivateRoute 
                                    element={<BreakTimeDashboard />} 
                                />
                            </BreakTimeContextProvider>
                        }
                    />
                    <Route 
                        path="breaks" 
                        element={
                            <BreakTimeContextProvider>
                                <PrivateRoute 
                                    element={<BreakTime />} 
                                />
                            </BreakTimeContextProvider>
                        }
                    />
                    <Route 
                        path="panel" 
                        element={
                            <BreakTimeContextProvider>
                                <PrivateRoute 
                                    element={<BreakTimePanel />} 
                                />
                            </BreakTimeContextProvider>
                        }
                    />
                </Route>
                <Route
                    path="my_auth_onus"
                    element={<PrivateRoute element={matches ? <MyAuthorizedOnusMobile /> : <MyAuthorizedOnus />} />}
                />
            </Route>
        </Routes>
    );
}
