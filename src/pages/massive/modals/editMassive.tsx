import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import { useAuth } from "../../../hooks/useAuth";
import { useResponse } from "../../../hooks/useResponse";

import { formatInput } from "../../../config/regex";

import { getCities } from "../../../services/apiManageONU/getCities";
import { updateMassive } from "../../../services/apiManageONU/updateMassive";

import { ICities } from "../../../interfaces/ICities";
import { IAddMassive } from "../../../interfaces/IAddMassiveForm";

import { FormAddMassive } from "../style";
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

//CONFIG PARA TAMANHO DO MENU DE OPÇÕES DAS CIDADES
const MenuProps = { PaperProps: { style: { maxHeight: 88 * 4.5 }}};

type LocalEditMassive = {
    open: boolean,
    handleClose: () => void;
    massive: IMassive
}

export function EditMassive(props: LocalEditMassive){
    const { user } = useAuth();
    const { setFetchResponseMessage } = useResponse();

    const [open, setOpen] = useState(false);
    const [openForecastTime, setOpenForecastTime] = useState(false);
    const [cities, setCities] = useState<ICities[]>([]);
    const [form, setForm] = useState<IAddMassive>({
        user: user?.uid,
        massiveId: props.massive.id,
        cityId: props.massive.Cities ? props.massive.Cities.id : null,
        forecastReturn:  props.massive.forecast_return ? dayjs(props.massive.forecast_return).add(3, 'hour').format('DD/MM/YY - HH:mm') + 'h': '',
        failureTime: dayjs(props.massive.failure_date).add(3, 'hour').format('DD/MM/YY - HH:mm') + 'h',
        forecastDateToISO: null,
        failureDateToISO: null,
        problemType: props.massive.type,
        description: props.massive.description,
        affectedLocals: props.massive.affected_local
    });

    useEffect(()  => {
        const getData = async () => {
            const response = await getCities();
            if(response){
                if(response.success){
                    setCities(response.responses.response);
                }
            } else {
                setFetchResponseMessage('error/no-connection-with-API');
            }
        }
        getData();
    }, []);

    const handleTimeChange = (newTime: Date | null) => {
        setForm({
            ...form,
            failureTime: dayjs(newTime).format('DD/MM/YY - HH:mm') + 'h',
            failureDateToISO: dayjs(newTime).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
        });
    };

    const handleForecastTimeChange = (newTime: Date | null) => {
        setForm({
            ...form,
            forecastReturn: dayjs(newTime).format('DD/MM/YY - HH:mm') + 'h',
            forecastDateToISO: dayjs(newTime).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
        });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number | null>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleAccept = () => { setOpen(false); };
    const handleForecastTimeAccept = () => { setOpenForecastTime(false); };
    const handleOpenPicker = () => { setOpen(true); };
    const handleOpenForecastPicker = () => { setOpenForecastTime(true); };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!form.affectedLocals.match(formatInput)){
            setFetchResponseMessage('info/massive-invalid-input');
        } else {
            const response = await updateMassive(form);
            if(response){
                if(response.success){
                    setFetchResponseMessage(response.responses.status);
                    props.handleClose();
                } else {
                    setFetchResponseMessage(response.messages.message);
                }
            } else {
                setFetchResponseMessage('error/no-connection-with-API');
            }
        }
    };

    return(
        <Modal
            className="flex"
            open={props.open}
            onClose={props.handleClose}
        >
            <FormAddMassive className="flex" onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>Cidade</InputLabel>
                    <Select
                        name='cityId'
                        value={form.cityId}
                        onChange={(e) => handleFormChange(e)}
                        input={<OutlinedInput label="Cidade" />}
                        MenuProps={MenuProps}
                    >
                        {cities.map((city) => (
                            <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Tipo de problema</InputLabel>
                    <Select
                        label="Tipo de problema"
                        name="problemType"
                        value={form.problemType}
                        onChange={handleFormChange} 
                    >
                        <MenuItem value="Energia">Energia</MenuItem>
                        <MenuItem value="Rompimento">Rompimento</MenuItem>
                        <MenuItem value="Parado">Parado</MenuItem>
                        <MenuItem value="Lentidão">Lentidão</MenuItem>
                        <MenuItem value="CTO Parado">CTO Parado</MenuItem>
                        <MenuItem value="Manutenção">Manutenção</MenuItem>
                        <MenuItem value="Troca de Poste">Troca de Poste</MenuItem>
                        <MenuItem value="Queda">Queda</MenuItem>
                        <MenuItem value="Falha geral">Falha geral</MenuItem>
                    </Select>
                </FormControl>
                <div className="flex">
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2, mr:1 }}>
                        <InputLabel>Horario de falha</InputLabel>
                        <OutlinedInput
                            required
                            label="Horario de falha"
                            name="failureTime"
                            type='text'
                            value={form.failureTime}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton edge="end" onClick={handleOpenPicker}>
                                        <AccessTimeOutlinedIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {
                            open && (
                                <StaticDateTimePicker
                                    className="date-timer"
                                    ampm={false}
                                    onChange={handleTimeChange}
                                    onAccept={handleAccept}
                                    displayStaticWrapperAs='desktop'
                                />
                            )
                        }
                    </FormControl>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel htmlFor="outlined-adornment-password">Previsão de retorno</InputLabel>
                        <OutlinedInput
                            label="Previsão de retorno"
                            type='text'
                            name="forecastReturn"
                            value={form.forecastReturn}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton edge="end" onClick={handleOpenForecastPicker}>
                                        <AccessTimeOutlinedIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {
                            openForecastTime && (
                                <StaticDateTimePicker
                                    className="date-timer"
                                    ampm={false}
                                    onChange={handleForecastTimeChange}
                                    onAccept={handleForecastTimeAccept}
                                    displayStaticWrapperAs='desktop'
                                />
                            )
                        }
                    </FormControl>
                </div>
                <TextField
                    required
                    label="Locais afetados. Ex: Bairros, Ruas" 
                    variant="outlined"
                    name="affectedLocals"
                    fullWidth
                    value={form.affectedLocals}
                    onChange={handleFormChange}
                    sx={{ mt: 2 }}
                />
                <TextField
                    fullWidth
                    multiline
                    label="Informações Adicionais"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    rows={4}
                    sx={{ mt: 2 }}
                />
                <div className="flex">
                    <IconButton color="success" type="submit">
                        <DoneIcon />
                    </IconButton>
                    <IconButton color="error" onClick={props.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </FormAddMassive>
        </Modal>
    );
}