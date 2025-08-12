import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { useResponse } from "../../../hooks/useResponse";

import { 
    Card, 
    Cards, 
    OffCard, 
    CardController, 
    IconMassivePeople, 
    MassivePeopleStyle 
} from "../../massive/style";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { getMassiveLogs } from "../../../services/apiManageONU/getMassiveLogs";
import { FilterMassives } from "./filterOptions";
import { getClientMassive } from "../../../services/apiManageONU/getClientMassive";
import { LogsOnuStyle } from "./styles";
import { IClientMassive } from "../../../interfaces/IClientMassive";
import { MapModal } from "../../massive/map";
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

export function LogsMassives(){
    const { setFetchResponseMessage } = useResponse();

    const [openMaps, setOpenMaps] = useState(false);
    const [filterParams, setFilterParams] = useState<any>(undefined);
    const [massives, setMassives] = useState<IMassive[]>([]);
    const [clientMassive, setClientMassive] = useState<IClientMassive[]>([]);
    const [clientsLocation, setClientsLocation] = useState<any>([]);
    const [showOffCard, setShowOffCard] = useState<number[]>([]);
    const [showMassivePeople, setShowMassivePeople] = useState<number[]>([]);

    useEffect(() => {
        const getData = async () => {
            if(filterParams){
                const response = await getMassiveLogs({
                    initialDate: filterParams.initialDate,
                    lastDate: filterParams.lastDate,
                    problemType: filterParams.problemType,
                    cityId: filterParams.cityId,
                    cpf: filterParams.cpf
                });
                
                if(response){
                    if(response.success){
                        setMassives(response.responses.response);
                    } else {
                        setFetchResponseMessage(response.messages.message);
                    }
                } else {
                    setFetchResponseMessage('error/no-connection-with-API');
                }
            }
        }
        getData();
    }, [filterParams]);

    const handleShowOffCard = (whichCard: number) => {
        if (showOffCard.includes(whichCard)) {
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

    const handleOpenMaps = () => {
        const locations: any = [];
        clientMassive.map((client: IClientMassive) => {
            if(client.lat && client.lng){
                locations.push({ 
                    name: client.name, 
                    lat: parseFloat(client.lat),
                    lng: parseFloat(client.lng)
                });
            }
        });
        setClientsLocation(locations);
        setOpenMaps(true);
    };
    const handleCloseMaps = () => setOpenMaps(false);

    const handleFilterChange = (filter: any | null) => {
        setFilterParams(filter);
    };

    return(
        <LogsOnuStyle className="flex">
            <FilterMassives onFilterChange={handleFilterChange}/>
            <Cards>
                {
                    massives.map((massive, index: number) => {
                        return(
                            <CardController className="flex" key={index}>
                                <Card className="flex" offCardOpen={showOffCard.includes(index)}>
                                    <div className="header flex">
                                        <h2>{massive.type} - {dayjs(massive.failure_date).add(3, "hour").format('HH:mm') + 'h'}</h2>
                                        <p>{massive.Cities ? massive.Cities.name : ''}</p>
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
                                                                    <p>Adicionado por: {client.User!.name}</p>
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
                                        {
                                            massive.User_Massive_finished_by ? 
                                            <p>
                                                Finalizado por
                                                {' ' + massive.User_Massive_finished_by.name}
                                            </p> 
                                                : ''
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
        </LogsOnuStyle>
    )
}