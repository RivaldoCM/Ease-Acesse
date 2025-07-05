import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import { useAuth } from "../../../hooks/useAuth";
import { useResponse } from "../../../hooks/useResponse";

import { formatInput } from "../../../config/regex";

import { getCities } from "../../../services/apiManageONU/getCities";
import { addMassive } from "../../../services/apiManageONU/addMassive";

import { ICities } from "../../../interfaces/ICities";
import { IAddMassive } from "../../../interfaces/IAddMassiveForm";

import { FormAddMassive } from "../style";
import { 
    Autocomplete, 
    CircularProgress, 
    FormControl, 
    IconButton, 
    InputAdornment, 
    InputLabel, 
    MenuItem, 
    Modal, 
    OutlinedInput, 
    Select, 
    SelectChangeEvent, 
    TextField 
} from "@mui/material";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

export function AddMassive(props: any){
    const { user } = useAuth();
    const { setFetchResponseMessage } = useResponse();

    const [openAutoCompleteCities, setOpenAutoCompleteCities] = useState(false);
    const [open, setOpen] = useState(false);
    const [openForecastTime, setOpenForecastTime] = useState(false);
    const [cities, setCities] = useState<ICities[]>([]);
    const [form, setForm] = useState<IAddMassive>({
        user: user?.uid,
        cityId: 0 || null,
        forecastReturn: '',
        failureTime: '',
        forecastDateToISO: null,
        failureDateToISO: null,
        problemType: 'Energia',
        description: '',
        affectedLocals: ''
    });

    const loadingCities = openAutoCompleteCities && cities.length === 0;
    useEffect(() => {
        (async () => {
            if(loadingCities){
                const response = await getCities();
                if(response){
                    if(response.success){
                        setCities(response.responses.response);
                    }
                } else {
                    setFetchResponseMessage('error/no-connection-with-API');
                }
            }
        })();
    }, [loadingCities]);

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

    const handleCityChange = (_e: unknown, value: ICities | null) => {
        if(value){
            setForm({
                ...form,
                cityId: value.id
            });
        } else {
            setForm({
                ...form,
                cityId: value
            });
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleAccept = () => {
        setOpen(false);
    };

    const handleForecastTimeAccept = () => {
        setOpenForecastTime(false);
    };

    const handleOpenPicker = () => {
        setOpen(true);
    };

    const handleOpenForecastPicker = () => {
        setOpenForecastTime(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!form.affectedLocals.match(formatInput)){
            setFetchResponseMessage('info/massive-invalid-input');
        } else {
            const response = await addMassive(form);
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
        <React.Fragment>
            <Modal
                className="flex"
                open={props.open}
                onClose={props.handleClose}
            >
                <FormAddMassive className="flex" onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <Autocomplete
                            id="asynchronous-cities"
                            open={openAutoCompleteCities}
                            onOpen={() => {setOpenAutoCompleteCities(true)}}
                            onClose={() => {setOpenAutoCompleteCities(false)}}
                            onChange={handleCityChange}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            options={cities}
                            getOptionLabel={(city) => city.name}
                            loading={loadingCities}
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id}>
                                        {option.name}
                                    </li>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    required
                                    label="Cidade"
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
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Tipo de problema</InputLabel>
                        <Select 
                            label='Tipo de problema' 
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
                        </Select>
                    </FormControl>
                    <div className="flex wrap">
                        <FormControl variant="outlined" sx={{ mt: 1, mr: 1 }}>
                            <InputLabel>Horario de falha</InputLabel>
                            <OutlinedInput
                                required
                                label="Horario de falha"
                                name="failureTime"
                                type="text"
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
                        <FormControl variant="outlined" sx={{ mt: 1 }}>
                            <InputLabel>Previsão de retorno</InputLabel>
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
                        label="Locais afetados Ex: Bairros, Ruas, Placa/Pon" 
                        variant="outlined"
                        name="affectedLocals"
                        fullWidth
                        onChange={handleFormChange}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Informações Adicionais"
                        name="description"
                        multiline    
                        fullWidth
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
        </React.Fragment>
    )
}