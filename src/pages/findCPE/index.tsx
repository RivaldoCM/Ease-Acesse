import React, { useEffect, useState } from "react";
import { Form } from "../onuDelete/style";
import { Autocomplete, Button, CircularProgress, TextField } from "@mui/material";

import SendIcon from '@mui/icons-material/Send';
import { getCities } from "../../services/apiManageONU/getCities";
import { useResponse } from "../../hooks/useResponse";
import { useLoading } from "../../hooks/useLoading";
import { ICities } from "../../interfaces/ICities";
import { findCPE } from "../../services/apiManageONU/findCPE";
import { useAuth } from "../../hooks/useAuth";
import { Container } from "./style";

export function FindCPE(){
    const { user } = useAuth(); 
    const { setFetchResponseMessage } = useResponse();
    const { isLoading, startLoading, stopLoading } = useLoading();

    const [cities, setCities] = useState<ICities[]>([]);
    const [open, setOpen] = useState(false);
    const [cpes, setCpes] = useState([]);
    const [cityId, setCityId] = useState<number | '' | null>(null);
    const [macAddress, setMacAddress] = useState<string | null>(null);

    const loadingCities = open && cities.length === 0;
    useEffect(() => {
        let active = true;
        if (!loadingCities) {
            return undefined;
        }

        (async () => {
            const response = await getCities();
            if (active) {
                if(response){
                    if(response.success){
                        setCities(response.responses.response);
                    }
                } else {
                    setFetchResponseMessage('error/no-connection-with-API');
                }
            }
        })();
        return () => {active = false;};
    }, [loadingCities]);

    const handleCityChange = (_e: unknown, value: ICities | null) => {
        if(value){
            setCityId(value.id);
        }else{
            setCityId(value);
        }
    };

    const handleMacChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMacAddress(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startLoading();
        if(cityId && macAddress){
            const response = await findCPE({
                userId: user?.uid,
                cityId: cityId,
                mac: macAddress
            });

            if(response){
                if(response.success){
                    setCpes(response.responses.response);
                }
            } else {
                setFetchResponseMessage('error/no-connection-with-API');
            }
        }else{
            setFetchResponseMessage('error/empty-fields');
        }
        stopLoading();
    }

    return(
        <Container>
        <Form className="flex" onSubmit={handleSubmit}>
                <div className="controller flex">
                    <Autocomplete
                        open={open}
                        sx={{ width: '250px' }}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        onChange={handleCityChange}
                        options={cities}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(city) => city.name}
                        loading={loadingCities}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.id}>
                                    {option.name}
                                </li>
                            );
                        }}
                        renderInput={(params) => {
                            return(
                                <TextField
                                    {...params}
                                    label="Cidades"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                        <React.Fragment>
                                            {loadingCities ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}}
                    />
                    <TextField 
                        required
                        label="Ex: aa:bb:cc:dd:ee:ff" 
                        sx={{width: '250px'}}
                        value={macAddress}
                        onChange={handleMacChange}
                    />
                </div>
                {isLoading ?
                    <CircularProgress className="MUI-CircularProgress" color="primary"/>
                    :
                    <Button
                        size="medium"
                        variant="contained" 
                        endIcon={<SendIcon />}
                        type="submit"
                    >
                        Buscar roteador
                    </Button>
                }
            </Form>
            {
                cpes.length > 0 ?
                <div className="flex cpe">
                    <ul className="list-cpes">
                        {cpes.map((cpe: any, index) => {
                            return(
                                <li key={index}>
                                    <p>MAC: {cpe.mac}</p>
                                    <p>IP: {cpe.ip}</p>
                                    <a rel="stylesheet" href={`https://${cpe.ip}:8085`} target="_blank">abrir</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                :
                null
            }
        </Container>
    )
}