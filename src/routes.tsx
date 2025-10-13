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
import { Exitlag } from "./pages/exitLag";
import { EditOlt } from "./pages/admin/olts/editOlt";
import { AddOlt } from "./pages/admin/olts/addOlt";
import { OnuInfo } from "./pages/OnuInfo";
//import { FiberNetwork } from "./pages/telecom/FiberNetwork";
import { Tickets } from "./pages/helpdesk/tickets";
import { Dashboard } from "./pages/helpdesk/dashboard";
import { ClientLocationByFiberNetwork } from "./pages/telecom/ClientLocationByFiberNetwork/mobile";
import ClientFiberNetworkData from "./pages/telecom/ClientLocationByFiberNetwork/desktop";
import { FindCPE } from "./pages/findCPE";
import { TicketContextProvider } from "./contexts/TicketContext";
import { SystemManagement } from "./pages/admin/systemManagement";
import { privateRoutes } from "./config/privateRoutes";
import { PageNotFound } from "./components/SVG/pageNotFound";

const PrivateRoute: React.FC<{element: ReactElement,path: string}> = ({ element, path }: {element: ReactElement, path: string}) => {
    const response = privateRoutes(path);
    switch(response){
        case 100:
            return element;
        case 401:
            return <Navigate to='/login' />;
        case 403:
            return <Navigate to='/*' />;
    }
}

export function AppRoutes() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useAuth(); 
    const { socket, rooms } = useSocket();

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
            navigate(localStorage.getItem("initialPage")!);
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
                        <PrivateRoute element={ <MassivePanel /> } path="/massive_panel"/>
                    </MassiveContextProvider>
                }
            />
            <Route 
                path="*"
                element={
                    <PageNotFound />
                }
            />
            <Route path="" element={matches ? <MobileDrawerMenu /> : <MenuDrawer />}>
                <Route path="olts">
                    <Route
                        path=""
                        element={<PrivateRoute element={<Olts />} path="/olts" />}
                    />
                    <Route
                        path=":id"
                        element={<PrivateRoute element={<EditOlt />} />}
                    />
                    <Route
                        path="new_olt"
                        element={<PrivateRoute element={<AddOlt />} path="/new_olt" />}
                    />
                </Route>
                <Route
                    path="users"
                    element={<PrivateRoute element={<Users />} path="/users" />}
                />
                <Route
                    path="onuDelete"
                    element={<PrivateRoute element={<OnuDelete />} path="/onuDelete"/>}
                />
                <Route
                    path="logs_onu"
                    element={<PrivateRoute element={<LogsOnu />} path="/logs_onu"/>}
                />
                <Route
                    path="auth_onu"
                    element={
                        <AuthOnuContextProvider>
                            <PrivateRoute
                                element={<AuthOnuController />}
                                path="/auth_onu"
                            />
                        </AuthOnuContextProvider>
                    }
                />
                <Route 
                    path="massive"
                    element={
                        <MassiveContextProvider>
                            <PrivateRoute element={ <Massive />} path="/massive" />
                        </MassiveContextProvider>
                    }
                />
                <Route 
                    path="logs_massive"
                    element={
                        <PrivateRoute element={ <LogsMassives />} path="/logs_massive" />
                    }
                />
                <Route path="break_time">
                    <Route 
                        path="dashboard" 
                        element={
                            <BreakTimeContextProvider>
                                <PrivateRoute 
                                    element={<BreakTimeDashboard />} 
                                    path="/break_time/dashboard"
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
                                    path="/break_time/breaks"
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
                                    path="/break_time/panel"
                                />
                            </BreakTimeContextProvider>
                        }
                    />
                </Route>
                <Route
                    path="my_auth_onus"
                    element={<PrivateRoute element={matches ? <MyAuthorizedOnusMobile /> : <MyAuthorizedOnus />} path="my_auth_onus"/>}
                />
                <Route 
                    path="exitlag"
                    element={
                        <PrivateRoute
                            element={<Exitlag />}
                            path="/exitlag"
                        />
                    }
                >
                </Route>
                <Route 
                    path="onu_info"
                    element={
                        <PrivateRoute element={<OnuInfo />} path="/onu_info"/>
                    }
                >
                </Route>
                <Route 
                    path="find_CPE"
                    element={
                        <PrivateRoute element={<FindCPE />} path="/find_CPE"/>
                    }
                    
                >
                </Route>
                {/*
                <Route
                    path="/fiber_network"
                    element={
                        <PrivateRoute element={<FiberNetwork/>} />
                    }
                />
                */ }

                <Route
                    path="/client_location"
                    element={
                        <PrivateRoute element={matches ? <ClientLocationByFiberNetwork /> : <ClientFiberNetworkData />} />
                    }
                />
                <Route path="helpdesk">
                    <Route 
                        path="dashboard"
                        element={
                            <PrivateRoute element={<Dashboard />} />
                        }
                    />
                    <Route
                        path="tickets"
                        element={
                            <TicketContextProvider>
                                <PrivateRoute 
                                    element={<Tickets/>}
                                    path="/helpdesk/tickets"
                                />
                            </TicketContextProvider>
                        }
                    />
                </Route>
                <Route
                    path="role_management"
                    element={
                        <PrivateRoute 
                            element={<SystemManagement />}
                            path="/role_management"
                        />
                    }
                />
            </Route>
        </Routes>
    );
}
