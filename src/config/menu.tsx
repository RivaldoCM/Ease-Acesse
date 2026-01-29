import cloneDeep from 'lodash/cloneDeep';

import { IAllPages } from '../interfaces/IAllPages';

import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import { IconExitLag } from '../assets/icons/iconExitLag';
import WifiChannelOutlinedIcon from '@mui/icons-material/WifiChannelOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import RouterOutlinedIcon from '@mui/icons-material/RouterOutlined';

export var handleDynamicPagesByRule: IAllPages[];
export const handlePages: IAllPages[] = [
    {
        name: "Area Tecnica",
        pages: [
           {
                auth_onu: 'Provisiona ONU'
           },
           {
                onuDelete: 'Desprovisiona ONU'
           },
           {
                my_auth_onus: 'Meus Provisionamentos'
           },
           {
                onu_info: 'Consultar ONU'
           },
           {
                find_CPE: 'Ver Roteador Resetado'
           }
        ]
    },
    {
        name: "Admin",
        pages: [
            {
                users: 'Usuários',
            },
            {
                olts: "OLT's"
            }
        ]
    },
    {
        name: 'Auditoria',
        pages: [
            {
                logs_onu: 'Log de Onu',
            }
        ]
    },
    {
        name: 'Massiva',
        pages: [
            {
                massive: "Massivas"
            },
            {
                logs_massive: 'Históricos'
            },
            {
                massive_panel: 'Painel de Massivas'
            }
        ]
    },
    {
        name: 'Pausas',
        pages: [
            {
                'break_time/dashboard': 'Dashboard de Pausas'
            },
            {
                'break_time/breaks': 'Horários de Pausa'
            },
            {
                'break_time/panel': 'Painel de Pausas'
            },
        ]
    },
    {
        name: "Infra",
        pages: [
            /*{fiber_network: 'Mapa de rede Fibra(DEV)'},*/
            {client_location: 'Organização de clientes'}
        ]
    },
    {
        name: "HelpDesk",
        pages: [
            /*
            {
                'helpdesk/dashboard': 'Dashboard'
            },
            */
            {
                'helpdesk/tickets': 'Tickets'
            }
        ]
    },
    {
        name: 'ExitLag',
        pages: [
            {exitlag: 'Dashboard Clientes'}
        ]
    }
]

export const handleShowPageByRule = (rule?: number) => {
    switch(rule){
        case 14:
        case 15:
        case 16:
        case 17:
            let allPages = cloneDeep(handlePages);
        return handleDynamicPagesByRule = allPages;
        case 10: 
            let onusMassive = cloneDeep(handlePages);
            onusMassive.splice(1,2);
            onusMassive.splice(2,4);
            onusMassive[1].pages.splice(1,2);
        return handleDynamicPagesByRule = onusMassive;
        case 1:
        case 2: 
            let withoutDashboardBreak = cloneDeep(handlePages);

            withoutDashboardBreak.splice(1,2);
            withoutDashboardBreak[2].pages.splice(0,1);
            withoutDashboardBreak.splice(3,2);

        return handleDynamicPagesByRule = withoutDashboardBreak;
        case 6:
            let massiveAndExitLag = cloneDeep(handlePages);
            massiveAndExitLag.splice(0,3);
            massiveAndExitLag.splice(1,3);
            return handleDynamicPagesByRule = massiveAndExitLag;
        case 3:
            let onlyBreakTime = cloneDeep(handlePages);
            onlyBreakTime[0].pages.splice(2,1);
            onlyBreakTime.splice(1,2);
            onlyBreakTime.splice(3,2);
            return handleDynamicPagesByRule = onlyBreakTime;
        case 19:
            let withoutAdmin = cloneDeep(handlePages);
            withoutAdmin.splice(1,1);
            withoutAdmin.splice(3,1);
            withoutAdmin.splice(5,1);
        return handleDynamicPagesByRule = withoutAdmin;
        default:
            let onlyMassive = cloneDeep(handlePages);
            onlyMassive.splice(0,3);
            onlyMassive.splice(1,4);
        return handleDynamicPagesByRule = onlyMassive;
    }
}

export const handleIconMenu = (text: string): React.ReactElement => {
    switch(text){
        case 'auth_onu':
            return <MiscellaneousServicesOutlinedIcon />;
        case 'onuDelete':
            return <HighlightOffOutlinedIcon />;
        case 'users':
            return <AdminPanelSettingsOutlinedIcon />;
        case "olts":
            return <AccountTreeOutlinedIcon />;
        case 'logs_onu':
            return <TroubleshootOutlinedIcon />;
        case 'massive':
            return <ViewModuleOutlinedIcon />;
        case 'logs_massive':
            return <LibraryBooksOutlinedIcon />;
        case 'massive_panel':
            return <DesktopWindowsOutlinedIcon />;
        case 'my_auth_onus':
            return <BallotOutlinedIcon />;
        case 'break_time/breaks':
            return <AccessTimeRoundedIcon />;
        case 'break_time/dashboard':
            return <SpaceDashboardOutlinedIcon />;
        case 'break_time/panel':
            return <TvOutlinedIcon />;
        case 'exitlag':
            return <IconExitLag />;
        case 'onu_info':
            return <WifiChannelOutlinedIcon />;
        case 'helpdesk/tickets':
            return <ConfirmationNumberOutlinedIcon />;
        case 'helpdesk/dashboard':
            return <DashboardOutlinedIcon />;
        case 'client_location':
            return <AssignmentOutlinedIcon />;
        case 'fiber_network':
            return <SchemaOutlinedIcon />;
        case 'find_CPE':
            return <RouterOutlinedIcon />;
        default:
            return <></>;
    }
};