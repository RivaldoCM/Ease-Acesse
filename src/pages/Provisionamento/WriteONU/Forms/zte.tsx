import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLoading } from '../../../../hooks/useLoading';
import { useAuth } from '../../../../hooks/useAuth';
import { useAuthOnu } from '../../../../hooks/useAuthOnu';
import { useResponse } from '../../../../hooks/useResponse';

import { isValidCpf, spaceNotAllowed, wifiPassword } from '../../../../config/regex';
import { cleanUpModelName, typePppoeZte } from '../../../../config/typesOnus';
import { verifyOnuType } from '../../../../config/verifyOnuType';

import { writeONU } from '../../../../services/apiManageONU/writeOnu';
import { getPeopleId } from '../../../../services/apiVoalle/getPeopleId';
import { getConnectionId } from '../../../../services/apiManageONU/getConnectionId';
import { updateConnection } from '../../../../services/apiVoalle/updateConnection';
import { updateLogsOnu } from '../../../../services/apiManageONU/updateLogOnu';

import { IOnu } from '../../../../interfaces/IOnus';

import { InputContainer } from '../../../../styles/globalStyles';
import { HelpPopover, SIP, Wifi } from '../../style';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import DialerSipOutlinedIcon from '@mui/icons-material/DialerSipOutlined';
import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import { Divider, IconButton, Popover, Typography } from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

export function ZTEForm({onu}: IOnu){
    const navigate = useNavigate();
    const { user } = useAuth();
    const { authOnu, setAuthOnu, setOnus } = useAuthOnu();
    const { isLoading, startLoading, stopLoading } = useLoading();
    const { setFetchResponseMessage } = useResponse();

    const [checkedSIP, setCheckedSIP] = useState(false);
    const [checkBandSteering, setCheckBandSteering] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        setAuthOnu({
            ...authOnu,
            sipUser: '',
            sipPass: ''
        });
    }, [checkedSIP === false]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAuthOnu({
            ...authOnu,
            [e.target.name]: e.target.value
        });
    };

    const handleChangeSIP = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedSIP(event.target.checked);
    };

    const handleChangeCheckBandSteering = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBandSteering(event.target.checked);
        setAuthOnu({
            ...authOnu,
            isActiveBS: event.target.checked
        });
    };

    const handleUpdateOltData = () => {
        setAuthOnu((prevAuthOnu) => ({
            ...prevAuthOnu,
            oltId: onu.oltId,
            modelOnu: cleanUpModelName(onu.model),
            onuType: verifyOnuType(onu.serialNumber),
            voalleAccessPointId: onu.voalleId
        }));
    }

    const handleClose = () => { setAnchorEl(null); };
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(isLoading){
            setFetchResponseMessage('warning/has-action-in-progress');
        }else if(!authOnu.cpf.match(isValidCpf)){
            setFetchResponseMessage('warning/invalid-cpf-input');
        }else if(typePppoeZte.includes(cleanUpModelName(onu.model))){
            if(checkBandSteering){
                if(!authOnu.wifiNameBS.match(spaceNotAllowed)){
                    setFetchResponseMessage('info/wifi-ssid-did-not-match');
                    return;
                }
                if(!authOnu.wifiPasswordBS.match(wifiPassword)){
                    setFetchResponseMessage('info/wifi-password-did-not-match');
                    return;
                }
            } else {
                if(!authOnu.wifiName24.match(spaceNotAllowed) || !authOnu.wifiName58.match(spaceNotAllowed)){
                    setFetchResponseMessage('info/wifi-ssid-did-not-match');
                    return;
                }
                if(!authOnu.wifiPassword24.match(wifiPassword) || !authOnu.wifiPassword58.match(wifiPassword)){
                    setFetchResponseMessage('info/wifi-password-did-not-match');
                    return;
                }
            }
        }

        startLoading();
        const peopleId = await getPeopleId(authOnu.cpf);
        let connectionData = {contractId: 0, connectionId: 0, password: ''}
        
        if(peopleId){
            const response = await getConnectionId(authOnu.cpf, peopleId.id, authOnu.pppoeUser);
            if(response){
                if(response.success){
                    connectionData.connectionId = response.responses.response.connectionId;
                    connectionData.contractId = response.responses.response.contractId;
                    connectionData.password = response.responses.response.password;
                } else {
                    connectionData.contractId = 0;
                }
            } else {
                connectionData.contractId = 0;
            }
        }else{
            connectionData.contractId = 0;
        }

        const hasAuth = await writeONU({
            userId: user?.uid,
            oltId: authOnu.oltId,
            slot: onu.slot,
            pon: onu.pon,
            serialNumber: onu.serialNumber,
            modelOnu: authOnu.modelOnu,
            contract: connectionData.contractId,
            cpf: authOnu.cpf,
            pppoeUser: authOnu.pppoeUser,
            pppPass: authOnu.pppoePassword,
            wifiSSIDBS: authOnu.wifiNameBS,
            wifiPassBS: authOnu.wifiPasswordBS,
            wifiSSID24: authOnu.wifiName24,
            wifiPass24: authOnu.wifiPassword24,
            wifiSSID58: authOnu.wifiName58,
            wifiPass58: authOnu.wifiPassword58,
            sipUser: authOnu.sipUser,
            sipPass: authOnu.sipPass
        });
        stopLoading();

        if(hasAuth){
            if(!hasAuth.success){
                setFetchResponseMessage(hasAuth.messages.message);
                setOnus([]);
                setAuthOnu({
                    ...authOnu,
                    oltId: '',
                    voalleAccessPointId: ''
                });
                return;
            } else {
                setFetchResponseMessage(hasAuth.responses.status!);
                setOnus([]);
                setAuthOnu({
                    ...authOnu,
                    oltId: '',
                    cpf: '',
                    pppoeUser: '',
                    pppoePassword: '',
                    wifiNameBS: '',
                    wifiPasswordBS: '',
                    wifiName24: '',
                    wifiPassword24: '',
                    wifiName58: '',
                    wifiPassword58: '',
                    typeOnu: '',
                    modelOnu: 'F601',
                    voalleAccessPointId: ''
                });
                setTimeout(() => {
                    navigate('/my_auth_onus');
                }, 2000);
            }
        } else {
            setFetchResponseMessage('error/no-connection-with-API');
            return;
        }

        const onuId: number = hasAuth.responses.response.onuId;
        if(connectionData.connectionId){
            const response = await updateConnection({
                onuId: onuId,
                connectionId: connectionData.connectionId,
                pppoeUser: authOnu.pppoeUser,
                pppoePassword: connectionData.password,
                slot: onu.slot,
                pon: onu.pon,
                serialNumber: onu.serialNumber,
                modelOlt: onu.modelOlt,
                accessPointId: authOnu.voalleAccessPointId,
                wifiSSID: authOnu.wifiNameBS ? authOnu.wifiNameBS : authOnu.wifiName24,
                wifiPass: authOnu.wifiPasswordBS ? authOnu.wifiPasswordBS : authOnu.wifiPassword24
            });
            updateLogsOnu({id: hasAuth.responses.response.logId, isUpdated: response});
        } else {
            updateLogsOnu({id: hasAuth.responses.response.logId, isUpdated: false});
        }
    };

    const handleRenderAddicionalConfig = () => {
        const onuModel = cleanUpModelName(onu.model);
        switch(onuModel){
            case 'F680':
            case 'F670L':
            case 'F6600':
            case 'F6600P':
                return(
                    <React.Fragment>
                        <InputContainer>
                            <div className="text">
                                <p>Senha PPPoE: </p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='pppoePassword'
                                    value={authOnu.pppoePassword}
                                    onChange={(e) => handleChange(e)}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                        {
                            onu.serialNumber.startsWith('ZTEG') && (
                                <Wifi>
                                    <div className="wifi-header flex">
                                        <div className="flex">
                                            <RssFeedOutlinedIcon color="primary"/>
                                            <HelpPopover className="flex">
                                                <IconButton onClick={handleClick}>
                                                    <HelpOutlineOutlinedIcon fontSize="small" color="secondary"/>
                                                </IconButton>
                                                <Popover
                                                    id={id}
                                                    open={open}
                                                    anchorEl={anchorEl}
                                                    onClose={handleClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <Typography sx={{ p: 2, background: '#fffff0', color: '#000' }}>
                                                        A senha deve ter pelo menos 8 caracteres, 
                                                        <br/>sem espaços em branco ou caracteres especiais.
                                                    </Typography>
                                                </Popover>
                                            </HelpPopover>
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
                                </Wifi>
                            )
                        }
                        <SIP>
                            <div className="sip-header flex">
                                <DialerSipOutlinedIcon color="primary"/>
                                <p>Possui telefone?</p>
                                <Checkbox
                                    checked={checkedSIP}
                                    onChange={handleChangeSIP}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            {
                                checkedSIP && (
                                    <div className='input-sip'>
                                        <InputContainer>
                                            <div className="text">
                                                <p>Usuário SIP: </p>
                                            </div>
                                            <div className="content">
                                                <TextField
                                                    required
                                                    variant="standard"
                                                    name='sipUser'
                                                    value={authOnu.sipUser}
                                                    onChange={(e) => handleChange(e)}
                                                >
                                                </TextField>
                                            </div>
                                        </InputContainer>
                                        <InputContainer>
                                            <div className="text">
                                                <p>Senha SIP: </p>
                                            </div>
                                            <div className="content">
                                                <TextField
                                                    required
                                                    variant="standard" 
                                                    name='sipPass'
                                                    value={authOnu.sipPass}
                                                    onChange={(e) => handleChange(e)}
                                                >
                                                </TextField>
                                            </div>
                                        </InputContainer>
                                    </div>
                                )
                            }
                        </SIP>
                    </React.Fragment>
                )
            default:
            break;
        }
    };

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
                                    name='wifiNameBS'
                                    value={authOnu.wifiNameBS}
                                    onChange={(e) => handleChange(e)}
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
                                    name='wifiPasswordBS'
                                    value={authOnu.wifiPasswordBS}
                                    onChange={(e) => handleChange(e)}
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
                            <div className="text fs">
                                <p>Nome do Wifi 2.4:</p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='wifiName24'
                                    value={authOnu.wifiName24}
                                    onChange={(e) => handleChange(e)}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                        <InputContainer>
                            <div className="text fs">
                                <p>Senha do Wifi 2.4:</p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='wifiPassword24'
                                    value={authOnu.wifiPassword24}
                                    onChange={(e) => handleChange(e)}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                        <Divider />
                        <InputContainer>
                            <div className="text fs">
                                <p>Nome do Wifi 5.8:</p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='wifiName58'
                                    value={authOnu.wifiName58}
                                    onChange={(e) => handleChange(e)}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                        <InputContainer>
                            <div className="text fs">
                                <p>Senha do Wifi 5.8:</p>
                            </div>
                            <div className="content">
                                <TextField
                                    required
                                    variant="standard"
                                    name='wifiPassword58'
                                    value={authOnu.wifiPassword58}
                                    onChange={(e) => handleChange(e)}
                                >
                                </TextField>
                            </div>
                        </InputContainer>
                    </React.Fragment>
                );
        }
    }

    return(
        <form onSubmit={handleSubmit} className="flex">
            <InputContainer>
                <div className="text">
                    <p>CPF do Cliente: </p>
                </div>
                <div className="content">
                    <TextField
                        required
                        variant="standard"
                        name='cpf'
                        value={authOnu.cpf}
                        onChange={(e) => handleChange(e)}
                    >
                    </TextField>
                </div>
            </InputContainer>
            <InputContainer>
                <div className="text">
                    <p>PPPoE do cliente: </p>
                </div>
                <div className="content">
                    <TextField
                        required
                        variant="standard" 
                        name='pppoeUser'
                        value={authOnu.pppoeUser}
                        onChange={(e) => handleChange(e)}
                    >
                    </TextField>
                </div>
            </InputContainer>
            {
                handleRenderAddicionalConfig()
            }
            {
                isLoading ?
                <CircularProgress className="MUI-CircularProgress" color="primary"/>
                :
                <div className="flex">
                    <Button
                        type="submit" 
                        variant="outlined" 
                        endIcon={<AddOutlinedIcon />}
                        onClick={handleUpdateOltData}
                    >
                        Provisionar
                    </Button>
                </div>
            }
        </form>
    )   
}