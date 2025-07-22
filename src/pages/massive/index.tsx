import React, { useState } from "react";
import dayjs from "dayjs";

import { useAuth } from "../../hooks/useAuth";
import { useMassive } from "../../hooks/useMassive";
import { useResponse } from "../../hooks/useResponse";

import { getClientMassive } from "../../services/apiManageONU/getClientMassive";

import { AddMassive } from "./modals/addMassive";
import { EditMassive } from "./modals/editMassive";
import { FinishMassive } from "./modals/finishMassive";
import { AddMassivePeople } from "./modals/addMassivePeople";

import { IUsers } from "../../interfaces/IUsers";
import { IClientMassive } from "../../interfaces/IClientMassive";

import { MapModal } from "./map";
import { 
    Card, 
    Cards, 
    OffCard, 
    CardController, 
    Container, 
    IconMassivePeople, 
    MassivePeopleStyle 
} from "./style";
import { Fab, IconButton } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { NoData } from "../../components/SVG/noData";

type LocalAddPeopleMassive = {
    userId?: IUsers['id'];
    cityId: IMassive['Cities']['id'];
    massiveId: IMassive['id'];
}

type LocalFinishMassive = {
    userId?: IUsers['id'];
    massiveId: IMassive['id'];
}

export function Massive(){
    const { user } = useAuth();
    const { massives } = useMassive();
    const { setFetchResponseMessage } = useResponse();

    const [openMaps, setOpenMaps] = useState(false);
    const [openAddMassive, setOpenAddMassive] = useState(false);
    const [openEditMassive, setOpenEditMassive] = useState(false);
    const [openFinishMassive, setOpenFinishMassive] = useState(false);
    const [openAddPeopleMassive, setOpenAddPeopleMassive] = useState(false);
    const [clientMassive, setClientMassive] = useState<IClientMassive[]>([]);
    const [clientsLocation, setClientsLocation] = useState<{name: string, lat: number, lng: number}[]>([]);
    const [editMassiveData, setEditMassiveData] = useState<IMassive>();
    const [FinishMassiveData, setFinishMassiveData] = useState<LocalFinishMassive>();
    const [addPeopleData, setAddPeopleData] = useState<LocalAddPeopleMassive>();
    const [showOffCard, setShowOffCard] = useState<number[]>([]);
    const [showMassivePeople, setShowMassivePeople] = useState<number[]>([]);

    const handleShowOffCard = (whichCard: number) => {
        if (showOffCard.includes(whichCard)) {
            //CASO ESTEJA ABERTO, ENTRA AQ
            //NESSE CASO, PARA FECHAR, GERA UM NOVO ARRAY COM TODOS OS VALORES, MENOS O DO CARD CLICADO.
            setShowOffCard(showOffCard.filter(cardIndex => cardIndex !== whichCard));
        } else {
            setShowOffCard([...showOffCard, whichCard]);
        }
    }

    const handleShowMassivePeople = async (index: number, massiveId: number) => {
        if(showMassivePeople.includes(index)) {
            setShowMassivePeople(showMassivePeople.filter(cardIndex => cardIndex !== index));
        } else {
            setShowMassivePeople([index]);
            const response = await getClientMassive({massiveId: massiveId, cpf: undefined});
            if(response){
                if(response.success){
                    setClientMassive(response.responses.response);
                } else {
                    setFetchResponseMessage(response.messages.message);
                }
            } else {
                setFetchResponseMessage('error/no-connection-with-API');
            }
        }
    }

    const handleEditCard = (value: IMassive) => {
        handleOpenEditMassive();
        setEditMassiveData(value);
    }

    const handleAddPeopleToCard = (value: Pick<IMassive, 'Cities' | 'id'>) => {
        handleOpenAddPeopleMassive(); 
        setAddPeopleData({
            userId: user?.uid,
            cityId: value.Cities.id,
            massiveId: value.id
        });
    }

    const handleFinishMassive = (value: Pick<IMassive, 'id'>) => {
        handleOpenFinishMassive();
        setFinishMassiveData({
            userId: user?.uid,
            massiveId: value.id
        });
    }
    
    const handleOpenMaps = () => {
        const locations: any = [];
        clientMassive.map((client: IClientMassive) => {
            if(client.lat && client.lng){
                locations.push({ 
                    name: client.name, 
                    lat: parseFloat(client.lat.replace(',', '.')),
                    lng: parseFloat(client.lng.replace(',', '.'))
                });
            }
        });
        setClientsLocation(locations);
        setOpenMaps(true);
    };
    const handleCloseMaps = () => setOpenMaps(false);
    const handleOpenAddMassive = () => setOpenAddMassive(true);
    const handleCloseAddMassive = () => setOpenAddMassive(false);
    const handleOpenEditMassive = () => setOpenEditMassive(true);
    const handleCloseEditMassive = () => setOpenEditMassive(false);
    const handleOpenFinishMassive = () => setOpenFinishMassive(true);
    const handleCloseFinishMassive = () => setOpenFinishMassive(false);
    const handleOpenAddPeopleMassive = () => setOpenAddPeopleMassive(true);
    const handleCloseAddPeopleMassive = () => setOpenAddPeopleMassive(false);

    return(
        <React.Fragment>
            {
                (massives.length ? 
                    <Container>
                        <Cards>
                            {
                                massives.map((massive, index: number) => {
                                    return(
                                        <CardController className="flex" key={index}>
                                            <Card className="flex" offCardOpen={showOffCard.includes(index)}>
                                                <div className="header flex">
                                                    <h2>{massive.type} - {dayjs(massive.failure_date).add(3, "hour").format('HH:mm') + 'h'}</h2>
                                                    {massive.Cities && (
                                                        <p>{massive.Cities.name}</p>
                                                    )}
                                                    <IconMassivePeople>
                                                        <IconButton
                                                            className="off-card-button" 
                                                            size="small"
                                                            onClick={() => handleShowMassivePeople(index, massive.id)}
                                                        >
                                                            {showMassivePeople.includes(index) ? <CloseIcon color="error"/> : <Groups2RoundedIcon color="primary"/>}
                                                        </IconButton>
                                                    </IconMassivePeople>
                                                    {
                                                        showMassivePeople.includes(index) && (
                                                            <MassivePeopleStyle>
                                                                <div>
                                                                    <h4>Clientes Afetados</h4>
                                                                </div>
                                                                <div className="flex clients">
                                                                    {clientMassive && clientMassive.map((client, index: number) => {
                                                                        return(
                                                                            <div className="flex client" key={index}>
                                                                                <p><b>{index + 1}</b>: {client.name ? client.name : client.cpf}</p>
                                                                                <p>{client.address ? client.address : ''}</p>
                                                                                {
                                                                                    client.lat && client.lng ? 
                                                                                    <p>
                                                                                        Coordenadas: 
                                                                                        <a href={`https://www.google.com/maps?q= ${client.lat.replace(',', '.')}, ${client.lng.replace(',', '.')}`} target="_blank"> {client.lat + ', '+ client.lng}</a> 
                                                                                    </p>
                                                                                    : ''
                                                                                }
                                                                                <p>Adicionado por: {client.User.name}</p>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                                {
                                                                    clientMassive.length > 1 && (
                                                                    <IconButton size="small" color="info" onClick={() => handleOpenMaps()}>
                                                                        <MapOutlinedIcon />
                                                                    </IconButton>
                                                                    )
                                                                }
                                                            </MassivePeopleStyle>
                                                        )
                                                    }
                                                </div>
                                                <div className="content">
                                                    <div className="basic-info flex">
                                                        <LocationCityOutlinedIcon color="action" />
                                                        <p>{massive.affected_local}</p>
                                                    </div>  
                                                    <div className="description flex">
                                                        <DrawOutlinedIcon color="action" />
                                                        <p>{massive.description}</p>
                                                    </div>
                                                    <div className="flex">
                                                        {
                                                            massive.forecast_return ? 
                                                            <p>Previsão: {dayjs(massive.forecast_return).add(3, "hour").format('DD/MM [às] HH:mm') + 'h'}</p>
                                                            :
                                                            <></>
                                                        }
                                                    </div>
                                                </div>
                                            </Card>
                                            <OffCard className="flex" offCardOpen={showOffCard.includes(index)}>
                                                <IconButton
                                                    className="off-card-button" 
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleShowOffCard(index)}
                                                >
                                                    {showOffCard.includes(index) ? <ExpandMoreOutlinedIcon /> : <ExpandLessOutlinedIcon />}
                                                </IconButton>
                                                <div className="off-card-information">
                                                    <p>
                                                        Data da falha: {dayjs(massive.failure_date).add(3, "hour").format('DD/MM [às] HH:mm') + 'h'}
                                                    </p>
                                                    <p>
                                                        Aberto por
                                                        {' ' + massive.User_Massive_created_by.name + ' '} 
                                                        dia 
                                                        {' ' + dayjs(massive.created_at).add(3, "hour").format('DD/MM [às] HH:mm') + 'hrs'}
                                                    </p>
                                                    {
                                                        massive.User_Massive_last_updated_by ? 
                                                        <p>
                                                            Última edição feita por
                                                            {' ' + massive.User_Massive_last_updated_by.name}
                                                        </p> 
                                                            : ''
                                                    }
                                                </div>
                                                <div className="off-card-action-buttons flex">
                                                    <IconButton size="small" color="primary" onClick={() => handleAddPeopleToCard(massive)}>
                                                        <PersonAddOutlinedIcon />
                                                    </IconButton>
                                                    {
                                                        user?.rule! > 13 || user?.rule === 3 ? 
                                                        <React.Fragment>
                                                            <IconButton size="small" color="secondary" onClick={() => handleEditCard(massive)}>
                                                                <CreateOutlinedIcon />
                                                            </IconButton>
                                                            <IconButton size="small" color="success" onClick={() => handleFinishMassive(massive)}>
                                                                <DoneIcon />
                                                            </IconButton>
                                                        </React.Fragment> : 
                                                        <></>
                                                    }
                                                </div>
                                            </OffCard>
                                        </CardController>
                                    );
                                })
                            }
                        </Cards>
                        {
                            openMaps && (
                                <MapModal
                                    open={openMaps}
                                    locations={clientsLocation}
                                    handleClose={handleCloseMaps}
                                />
                            )
                        }
                        {
                            openEditMassive && (
                                <EditMassive 
                                    open={openEditMassive}
                                    massive={editMassiveData!}
                                    handleClose={handleCloseEditMassive}
                                />
                            )
                        }
                        {
                            openAddPeopleMassive && (
                                <AddMassivePeople
                                    open={openAddPeopleMassive}
                                    massive={addPeopleData!}
                                    handleClose={handleCloseAddPeopleMassive}
                                />
                            )
                        }
                        {
                            openFinishMassive && (
                                <FinishMassive 
                                    open={openFinishMassive}
                                    massive={FinishMassiveData!}
                                    handleClose={handleCloseFinishMassive}
                                />
                            )
                        }
                    </Container>
                    :
                    <div style={{ width: '100%', height: 'calc(100vh - 68px)' }}>
                        <NoData />
                    </div>
                )
            }
            {
                user?.rule! > 13 || user?.rule === 3 ?
                <Fab 
                    size="large" 
                    color="primary" 
                    style={{ position: 'fixed', bottom: '16px', right: '1rem' }}
                    onClick={() => handleOpenAddMassive()}
                >
                    <AddIcon />
                </Fab>
                :
                <></>
            }
            {
                openAddMassive && (
                    <AddMassive
                        open={openAddMassive}
                        handleClose={handleCloseAddMassive}
                    />
                )
            }
        </React.Fragment>
    );
}