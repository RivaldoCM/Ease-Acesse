import React, { useEffect, useState } from "react";

import { deleteOnu } from "../../services/apiManageONU/deleteOnu";

import { useLoading } from "../../hooks/useLoading";

import { Form } from "./style";
import {Autocomplete, CircularProgress} from "@mui/material";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import { useAuth } from "../../hooks/useAuth";
import { ICities } from "../../interfaces/ICities";
import { getCities } from "../../services/apiManageONU/getCities";
import { useResponse } from "../../hooks/useResponse";

export function OnuDelete(){
    const { user } = useAuth();
    const { setFetchResponseMessage } = useResponse();
    const { isLoading, startLoading, stopLoading } = useLoading();

    const [open, setOpen] = useState(false);
    const [cities, setCities] = useState<ICities[]>([]);
    const [form, setForm] = useState({
        cityId: '' as number | '' | null,
        serial: '',
    });

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
            setForm({
                ...form,
                cityId: value.id
            });
        }else{
            setForm({
                ...form,
                cityId: value
            });
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startLoading();

        const response = await deleteOnu({userId: user!.uid, cityId: parseInt(form.cityId as string), serialNumber: form.serial});
        stopLoading();
        if(response){
            if(response.success){
                setFetchResponseMessage(response.responses.status);
            } else {
                setFetchResponseMessage(response.messages.message);
            }
        } else {
            setFetchResponseMessage('error/no-connection-with-API');
        }
    };

    return(
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
                    label="Digite o serial da ONU"
                    sx={{ width: '250px' }}
                    value={form.serial}
                    name="serial"
                    onChange={handleFormChange}
                    required
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
                    Desprovisionar
                </Button>
            }
        </Form>
    )
}