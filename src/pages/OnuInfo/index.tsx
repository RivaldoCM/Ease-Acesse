import React, { useEffect, useState } from "react";

import { getCities } from "../../services/apiManageONU/getCities";
import { ICities } from "../../interfaces/ICities";
import { useResponse } from "../../hooks/useResponse";
import { useLoading } from "../../hooks/useLoading";
import { getOnuInfo } from "../../services/apiManageONU/getOnuInfo";
import { updateWifi } from "../../services/apiManageONU/updateWifi";
import { Act2436ANATEL, spaceNotAllowed, wifiPassword } from "../../config/regex";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { cleanUpModelName, typePppoeZte } from "../../config/typesOnus";

import { Form } from "../onuDelete/style";
import { Wifi } from "../Provisionamento/style";
import { InputContainer } from "../../styles/globalStyles";
import { Autocomplete, Button, Checkbox, CircularProgress, Divider, IconButton, Popover, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { Alarms, Container, DataField, InfoStyle, Macs, Wireless, WirelessContainer, WirelessTitle } from "./style";
//import { getVendors } from "../../services/macVendors/getVendors";
import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export function OnuInfo(){
    const { setFetchResponseMessage } = useResponse();
    const { isLoading, startLoading, stopLoading } = useLoading();

    const [onu, setOnu] = useState<IGetOnu | null>();
    const [open, setOpen] = useState(false);
    const [cities, setCities] = useState<ICities[]>([]);
    const [editWifi, setEditWifi] = useState(false);
    const [waitWifiRequest, setWaitWifiRequest] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [checkBandSteering, setCheckBandSteering] = useState(false);
    const [form, setForm] = useState({
        cityId: '' as number | '' | null,
        serial: '',
        wifiBS: null as string | null,
        passwordBS: null as string | null,
        wifi24: null as string | null,
        password24: null as string | null,
        wifi58: null as string | null,
        password58: null as string | null
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => { setAnchorEl(null); };

    const openPopOver = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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

    /*
    useEffect(() => {
        if(onu && onu.length > 0){
            onu[0].macs!.map(async(value) =>
                await getVendors(value.mac)
            )
        }
    },[onu]);
    */

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

    /*
    const getVendorsByMac = async (mac: string): Promise<any> => {
        const response = await getVendors(mac);
        console.log(response)
    }
    */

    const handleChangeCheckBandSteering = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBandSteering(e.target.checked);
    }

    const handleEditWifi = () => { setEditWifi(!editWifi); }
    const handleRenderWifiConfig = () => {
        switch(checkBandSteering){
            case true:
                return(
                    <React.Fragment>
                        <InputContainer>
                            <div className="text">
                                <p>Nome do Wifi:</p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='wifiBS'
                                    value={form.wifiBS}
                                    onChange={handleFormChange}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                        <InputContainer>
                            <div className="text">
                                <p>Senha do Wifi:</p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='passwordBS'
                                    value={form.passwordBS}
                                    onChange={handleFormChange}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                    </React.Fragment>
                );
            case false:
                return(
                    <React.Fragment>
                        <InputContainer>
                            <div className="text">
                                <p>Nome do Wifi 2.4:</p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='wifi24'
                                    value={form.wifi24}
                                    onChange={handleFormChange}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                        <InputContainer>
                            <div className="text">
                                <p>Senha do Wifi 2.4:</p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='password24'
                                    value={form.password24}
                                    onChange={handleFormChange}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                        <Divider />
                        <InputContainer>
                            <div className="text">
                                <p>Nome do Wifi 5.8:</p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='wifi58'
                                    value={form.wifi58}
                                    onChange={handleFormChange}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                        <InputContainer>
                            <div className="text">
                                <p>Senha do Wifi 5.8:</p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='password58'
                                    value={form.password58}
                                    onChange={handleFormChange}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                    </React.Fragment>
                );
        }
    }

    const handleSubmitWifi = async (e: any) => {
        e.preventDefault();

        if(checkBandSteering){
            if(form.wifiBS && !form.wifiBS.match(spaceNotAllowed)){
                setFetchResponseMessage('info/wifi-ssid-did-not-match');
                return;
            }
            if(form.passwordBS && !form.passwordBS.match(Act2436ANATEL)){
                setFetchResponseMessage('info/wifi-password-did-not-match');
                return;
            }
        } else {
            if(
                form.wifi24 && !form.wifi24.match(spaceNotAllowed)
                || form.wifi58 && !form.wifi58.match(spaceNotAllowed)
            ){
                setFetchResponseMessage('info/wifi-ssid-did-not-match');
                return;
            }
            if(
                form.password24 && !form.password24.match(Act2436ANATEL) 
                || form.password58 && !form.password58.match(Act2436ANATEL)
            ){
                setFetchResponseMessage('info/wifi-password-did-not-match');
                return;
            }
        }

        setWaitWifiRequest(true);
        const response = await updateWifi({
            onu: onu,
            form: form,
        });
        setWaitWifiRequest(false);

        if(response){
            if(response.success){
                setOnu(null);
                setFetchResponseMessage(response.responses.status);
            } else {
                setFetchResponseMessage(response.messages.message);
            }
        } else {
            setFetchResponseMessage('error/no-connection-with-API');
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setOnu(null);
        e.preventDefault();

        startLoading();
        const response = await getOnuInfo({cityId: parseInt(form.cityId as string), serialNumber: form.serial});
        stopLoading();

        if(response){
            if(response.success){
                setOnu(response.responses.response);
            } else {
                setFetchResponseMessage(response.messages.message);
            }
        } else {
            setFetchResponseMessage('error/no-connection-with-API');
        }
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
                        label="Digite o serial da ONU" 
                        sx={{width: '250px'}}
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
                        Coletar dados da ONU
                    </Button>
                }
            </Form>
            {
                onu && (
                    <DataField className="flex">
                        <div className="basic-info flex">
                            <p>Id: {onu.id}</p>
                            <p>Placa: {onu.slot}</p>
                            <p>Pon: {onu.pon}</p>
                            { onu.status ? <p>Status: {onu.status}</p> : <></> }
                        </div>
                        <div className="details">
                            <div className="infos">
                                {
                                    onu.oltRx || onu.onuRx ?
                                    <InfoStyle className="flex">
                                        { onu.oltRx && <p>OLT Rx: {onu.oltRx}</p> }
                                        { onu.onuRx && <p>ONU Rx: {onu.onuRx}</p> }
                                    </InfoStyle>
                                    :
                                    <></>
                                }
                                {
                                    onu.oltTx || onu.onuTx ?
                                    <InfoStyle className="flex">
                                        { onu.oltTx && <p>OLT Tx: {onu.oltTx}</p> }
                                        { onu.onuTx && <p>ONU Tx: {onu.onuTx}</p> }
                                    </InfoStyle>
                                    :
                                    <></>
                                }
                                {
                                    onu.temperature || onu.voltage ?
                                    <InfoStyle className="flex">
                                        {onu.temperature && <p>Temperatura: {onu.temperature + '°C'} </p> }
                                        {onu.voltage && <p>Voltagem: {onu.voltage + 'v'} </p> }
                                    </InfoStyle>
                                    :
                                    <></>
                                }
                                {
                                    onu.distance || onu.uptime ?
                                    <InfoStyle className="flex">
                                        {onu.distance && <p>Distancia: {onu.distance} </p> }
                                        {onu.uptime && <p>Uptime: {onu.uptime} </p> }
                                    </InfoStyle>
                                    :
                                    <></>
                                }
                                {
                                    onu.firmware || onu.model ?
                                    <InfoStyle className="flex">
                                        {onu.firmware && <p>Firmware: {onu.firmware}</p>}
                                        {onu.model && <p>Modelo: {onu.model}</p>}
                                    </InfoStyle>
                                    :
                                    <></>
                                }
                            </div>
                            <Macs className="flex">
                                {
                                    onu.macs && onu.macs.length > 0 && (
                                        <React.Fragment>
                                            <div><h4>MAC's na ONU</h4></div>
                                            <div className="table-wrapper flex">
                                                <div className="table-controller">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>MAC</th>
                                                                <th>VLAN</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                onu.macs.map((value, index) => {
                                                                    return(
                                                                        <tr key={index}>
                                                                            <td>{value.mac}</td>
                                                                            <td>{value.vlan}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )
                                }
                            </Macs>
                            <Alarms className="flex">
                                {
                                    onu.alarms && onu.alarms.length > 0 && (
                                        <React.Fragment>
                                            <div><h3>Alarmes</h3></div>
                                            <div className="table-wrapper flex">
                                                <div className="table-controller">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Inicio</th>
                                                                <th>Fim</th>
                                                                <th>Causa</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                onu.alarms.map((value, index) => {
                                                                    return(
                                                                        <tr key={index}>
                                                                            <td>{value.createdAt}</td>
                                                                            <td>{value.finishAt}</td>
                                                                            <td>{value.cause}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )
                                }
                            </Alarms>
                            {
                                onu.modelOlt === "ZTE" && typePppoeZte.includes(cleanUpModelName(onu.model!)) && (
                                    <WirelessContainer className="flex">
                                        <WirelessTitle className="flex">
                                            <h3>Wireless</h3>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color={!editWifi ? 'primary' : 'error'}
                                                endIcon={!editWifi ? <RssFeedOutlinedIcon /> : <CloseIcon />} 
                                                onClick={handleEditWifi} 
                                            >
                                                {!editWifi ? 'Editar wifi' : 'Cancelar'}
                                            </Button>
                                        </WirelessTitle>
                                        {
                                            !editWifi ?
                                                onu.wireless && Object.entries(onu.wireless).map(([key, value]) => {
                                                    return(
                                                        <Wireless className="flex">
                                                            <div className="interface flex">
                                                                <div><h4>{key}</h4></div>
                                                                <div>
                                                                    <p><b>SSID: </b>{value.name}</p>
                                                                    <p><b>Senha:</b> {value.password}</p>
                                                                    <p><b>Segurança:</b> {value.authType}</p>
                                                                    <p><b>Encriptação:</b> {value.encryption}</p>
                                                                    <p><b>Isolamento:</b> {value.isolation}</p>
                                                                    <p><b>Usuários online:</b> {value.currentUsers}</p>
                                                                </div>
                                                            </div>
                                                        </Wireless>
                                                    )
                                                })
                                            :
                                            <Wifi>
                                                <div className="wifi-header flex">
                                                    <div className="flex">
                                                        <RssFeedOutlinedIcon color="primary"/>
                                                        <div className="flex">
                                                            <IconButton onClick={handleClick}>
                                                                <HelpOutlineOutlinedIcon fontSize="small" color="secondary"/>
                                                            </IconButton>
                                                            <Popover
                                                                id={id}
                                                                open={openPopOver}
                                                                anchorEl={anchorEl}
                                                                onClose={handleClose}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'left',
                                                                }}
                                                            >
                                                                <Typography sx={{ p: 2, background: '#fffff0', color: '#000' }}>
                                                                    <p>
                                                                        ✅ A senha deve ter pelo menos <strong>8 caracteres</strong><br/>
                                                                        ✅ Deve conter ao menos <strong>uma letra maiúscula</strong>, <strong>uma letra minúscula</strong> e <strong>um número</strong><br/>
                                                                        ⚠️ Caracteres especiais são <strong>opcionais</strong>, mas se usados, devem ser um dos seguintes: <strong>@ $ ! % * ? &</strong><br/>
                                                                        ❌ <strong>Não deve conter espaços em branco</strong> ou outros caracteres especiais além dos permitidos
                                                                    </p>
                                                                </Typography>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                    <p>Ativar Band Steering?</p>
                                                    <Checkbox
                                                        checked={checkBandSteering}
                                                        onChange={handleChangeCheckBandSteering}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                    />
                                                </div>
                                                <div className='input-wifi'>
                                                    {
                                                        handleRenderWifiConfig()
                                                    }
                                                </div>
                                                <div className="flex">
                                                    {
                                                        waitWifiRequest ? <CircularProgress className="MUI-CircularProgress" size='sm'/> :
                                                        <Button
                                                            size="small" 
                                                            variant="contained"
                                                            color='success'
                                                            sx={{mb: '.5rem'}}
                                                            endIcon={<CheckRoundedIcon />}
                                                            onClick={handleSubmitWifi}
                                                        >
                                                            Salvar
                                                        </Button>
                                                    }

                                                </div>
                                            </Wifi>
                                        }
                                    </WirelessContainer>
                                )
                            }
                        </div>
                    </DataField>
                )
            }
        </Container>
        
    )
}