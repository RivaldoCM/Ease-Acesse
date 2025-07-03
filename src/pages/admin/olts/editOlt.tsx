import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useResponse } from "../../../hooks/useResponse";

import { isValidIp } from "../../../config/regex";

import { ICities } from "../../../interfaces/ICities";

import { getOlt } from "../../../services/apiManageONU/getOlt";
import { getCities } from "../../../services/apiManageONU/getCities";
import { updateOlt } from "../../../services/apiManageONU/updateOlt";
import { getOltModel } from "../../../services/apiManageONU/getOltModel";
import { getOltManufacturer } from "../../../services/apiManageONU/getOltManufacturer";

import { Inputs, InputsWrapper, OltStyledContainer, VlanConfig } from "./style";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export function EditOlt(){
    const params = useParams();
    const navigate = useNavigate();
    const { setFetchResponseMessage } = useResponse();

    const [showPassword, setShowPassword] = useState(false);
    const [showGeponPassword, setShowGeponPassword] = useState(false);
    const [showEnableGeponPassword, setShowEnableGeponPassword] = useState(false);
    const [ipValid, setIpValid] = useState(true);
    const [modelControl, setModelControl] = useState<number | string>();
    const [isModelChange, setIsModelChange] = useState(false);
    const [cities, setCities] = useState<ICities[]>([]);
    const [models, setModels] = useState<IOltModels[]>([]);
    const [manufacturers, setManufacturers] = useState<IOltManufacturer[]>([]);
    const [vlans, setVlans] = useState<IVlans[]>([]);
    const [form, setForm] = useState({
        id: '' as number | '',
        host: '',
        cityId: '' as number | '',
        name: '',
        manufacturerId: '' as number | '',
        modelId: '' as number | '',
        telnetUser: '',
        telnetPassword: '',
        geponUser: '',
        geponPassword: '',
        geponEnablePassword: '',
        isActive: '' as number | boolean | '',
        voalleId: '' as number | '',
        formatVlanConfig: 1,
        vlan: '',
        modifySlot: 1,
        modifyVlan: 0,
        modifyProfileVlan: '',
        modifySlotNumber: ''
    });

    useEffect(() => {
        async function getData(){
            const getCity = getCities();
            const getOlts = getOlt({id: parseInt(params.id!), vlans: true});
            const getModel = getOltModel();
            const getManufacturer = getOltManufacturer();
            const [olt, cities, models, manufacturers] = await Promise.all([getOlts, getCity, getModel, getManufacturer]);

            cities && cities.success ? setCities(cities.responses.response) : setCities([]);
            models && models.success ? setModels(models.responses.response) : setModels([]);
            manufacturers && manufacturers.success ? setManufacturers(manufacturers.responses.response) : setManufacturers([]);

            /*
                POPULANDO DADOS DA OLT REQUISITADA.
                ESTÁ RECEBENDO DOIS OBJETOS NO RETORNO DA API
                OS DADOS DA OLT E AS SUAUS VLANS
            */
            if (olt.success && olt.responses.response) {
                setForm({
                    ...form,
                    id: olt.responses.response.olt.id,
                    host: olt.responses.response.olt.host || '',
                    cityId: olt.responses.response.olt.city_id || '',
                    name: olt.responses.response.olt.name || '',
                    manufacturerId: olt.responses.response.olt.Olt_Manufacturer.id || '',
                    modelId: olt.responses.response.olt.Olt_Model.id || '',
                    telnetUser: olt.responses.response.olt.telnet_user || '',
                    telnetPassword: olt.responses.response.olt.telnet_password || '',
                    geponUser: olt.responses.response.olt.gepon_user || '',
                    geponPassword: olt.responses.response.olt.gepon_password || '',
                    geponEnablePassword: olt.responses.response.olt.gepon_enable_password || '',
                    isActive: olt.responses.response.olt.is_active === true ? 1 : 0,
                    voalleId: olt.responses.response.olt.voalle_id || '',
                });
                setVlans(olt.responses.response.vlans);
                setModelControl(olt.responses.response.olt.Olt_Model.id);
            }
        }
        getData();
    }, []);

    useEffect(() => {
        if(form.modelId !== '' && form.modelId !== modelControl){
            setVlans([]);
            setIsModelChange(true);
            setModelControl(form.modelId);
        }
    }, [form.modelId]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowGeponPassword = () => setShowGeponPassword((show) => !show);
    const handleClickShowEnableGeponPassword = () => setShowEnableGeponPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {event.preventDefault()};

    const handleMouseDownFormIp = async () => {
        //verifica se tem OLT's com o mesmo IP.
        if(form.host !== '' && form.host.match(isValidIp)){
            const response = await getOlt({id: parseInt(params.id!), host: form.host, vlans: false});
            if(response){
                if(response.success){
                    if(response.responses.response){
                        setFetchResponseMessage(response.responses.status);
                    }
                    setIpValid(!response.responses.response);
                }
            } else {
                setFetchResponseMessage('error/no-connection-with-API');
            }
        } else {
            setIpValid(false);
        }
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number | boolean | null>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleGenerateConfig = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let initialSlot = 0, modelSlot = 0, modelPon = 0, vlans: IVlans[] = [];

        if(form.modelId){
            models.map((model) => {
                if(model.id === form.modelId){
                    initialSlot = model.initial_slot,
                    modelSlot = model.slots,
                    modelPon = model.pons
                }
            });

            if(form.formatVlanConfig === 1){
                if(initialSlot > modelSlot){
                    for(let slots = initialSlot; slots < modelSlot + initialSlot; slots++){
                        for(let pons = 1; pons <= modelPon; pons++){
                            vlans.push({slot: slots, pon: pons, vlan: null});
                        }
                    }
                } else {
                    for(let slots = 1; slots <= modelSlot; slots++){
                        for(let pons = 1; pons <= modelPon; pons++){
                            vlans.push({slot: slots, pon: pons, vlan: null});
                        }
                    }
                }
            }else if(form.formatVlanConfig === 2){
                if(initialSlot > modelSlot){
                    for(let slots = initialSlot; slots < modelSlot + initialSlot; slots++){
                        for(let pons = 1; pons <= modelPon; pons++){
                            vlans.push({slot: slots, pon: pons, vlan: parseInt(form.vlan)});
                        }
                    }
                } else {
                    for(let slots = 1; slots <= modelSlot; slots++){
                        for(let pons = 1; pons <= modelPon; pons++){
                            vlans.push({slot: slots, pon: pons, vlan: parseInt(form.vlan)});
                        }
                    }
                }
            }else if(form.formatVlanConfig === 3){
                if(initialSlot > modelSlot){
                    for(let slots = initialSlot; slots < modelSlot + initialSlot; slots++){
                        for(let pons = 1; pons <= modelPon; pons++){
                            vlans.push({slot: slots, pon: pons, vlan: parseInt(form.vlan) + pons});
                        }
                    }
                } else {
                    for(let slots = 1; slots <= modelSlot; slots++){
                        for(let pons = 1; pons <= modelPon; pons++){
                            vlans.push({slot: slots, pon: pons, vlan: parseInt(form.vlan) + pons});
                        }
                    }
                }
            }else{
                if(initialSlot > modelSlot){
                    for(let slots = initialSlot; slots < modelSlot + initialSlot; slots++){
                        for(let pons = 1; pons <= modelPon; pons++){
                            vlans.push({slot: slots, pon: pons, vlan: parseInt(form.vlan) + slots});
                        }
                    }
                } else {
                    for(let slots = 1; slots <= modelSlot; slots++){
                        for(let pons = 1; pons <= modelPon; pons++){
                            vlans.push({slot: slots, pon: pons, vlan: parseInt(form.vlan) + slots});
                        }
                    }
                }
            }
            setVlans(vlans);
        } else {
            setFetchResponseMessage('error/missing-fields');
        }
    }

    const handleChangeVlan = (index: number) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(event.target.value === ''){
            const newVlans = [...vlans];
            newVlans[index] = {
                ...newVlans[index],
                vlan: null
            };
            setVlans(newVlans);
        } else {
            const newVlans = [...vlans];
            newVlans[index] = {
                ...newVlans[index],
                vlan: parseInt(event.target.value)
            };
            setVlans(newVlans);
        }
    }

    const handleChangeProfileVlan = (index: number) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(event.target.value === ''){
            const newProfile = [...vlans];
            newProfile[index] = {
                ...newProfile[index],
                profile_vlan: null
            };
            setVlans(newProfile);
        } else {
            const newProfile = [...vlans];
            newProfile[index] = {
                ...newProfile[index],
                profile_vlan: event.target.value
            };
            setVlans(newProfile);
        }
    }

    const generateSlotOptions = () => {
        let initialSlot = 0, modelSlots = 0, items = [];

        models.map((model) => {
            if(model.id === form.modelId){
                modelSlots = model.slots
                initialSlot = model.initial_slot
                form.modifySlot = initialSlot;
            }
        });

        if (initialSlot > modelSlots) {
            items.push(<MenuItem key={initialSlot} value={initialSlot}>{initialSlot}</MenuItem>);
        } else {
            for (let s = initialSlot; s <= modelSlots; s++) {
                items.push(<MenuItem key={s} value={s}>{s}</MenuItem>);
            }
        }

        return(
            [items]
        );
    }

    const handleModifyVlan = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newVlans = vlans.map((value) => {
            if(form.modifySlot === value.slot){
                return { ...value, vlan: form.modifyVlan};
            }
            return {...value}
        });
        setVlans(newVlans);
    }

    const handleChangeSlotValue = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newData = vlans.map((value) => {
            if(form.modifySlot === value.slot){
                return { ...value, slot: parseInt(form.modifySlotNumber)};
            }
            return {...value};
        });
        setVlans(newData);
    }

    const handleModifyProfileVlan = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newProfile = vlans.map((value) => {
            if(form.modifySlot === value.slot){
                return { ...value, profile_vlan: form.modifyProfileVlan};
            }
            return {...value}
        });
        setVlans(newProfile);
    }

    const handleSubmit = async () => {
        if(!form.name || !form.modelId || !form.host || !form.telnetUser || !form.telnetPassword || vlans.length === 0){
            setFetchResponseMessage('error/missing-fields');
        } else {
            if(!ipValid){
                setFetchResponseMessage('error/incorrect-fields');
            } else {
                const {vlan, formatVlanConfig, modifySlot, modifyVlan, modifyProfileVlan, ...dataForm} = form;
                dataForm.isActive = dataForm.isActive === 1 ? true : false;
                const response = await updateOlt(dataForm, vlans);
                if(response){
                    if(response.success){
                        setFetchResponseMessage(response.responses.status);
                        navigate('/olts');
                    } else {
                        setFetchResponseMessage(response.messages.message);
                    }
                } else {
                    setFetchResponseMessage('error/no-connection-with-API');
                }
            }
        }
    }

    return(
        <OltStyledContainer className="flex">
            <div>
                <Button
                    endIcon={<CheckIcon />} 
                    variant="contained" 
                    color="success"
                    size="small"
                    type="submit"
                    onClick={handleSubmit}
                >
                    Salvar OLT
                </Button>
            </div>
            <div className="wrapper flex">
                <InputsWrapper className="flex">
                    <h4>Configurações gerais</h4>
                    <Inputs>
                        <div>
                            <TextField
                                required
                                name="name"
                                label="Nome da OLT"
                                value={form.name}
                                onChange={handleFormChange}
                                sx={{ width: '264px' }}
                            />
                            <FormControl>
                                <InputLabel>Cidade</InputLabel>
                                <Select
                                    required
                                    name="cityId"
                                    label="Cidade"
                                    value={form.cityId || ''}
                                    onChange={handleFormChange}
                                >
                                    {
                                        cities.map((city, index) => {
                                            return(
                                                <MenuItem value={city.id} key={index}>{city.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    required
                                    name="isActive"
                                    label="Status"
                                    value={form.isActive}
                                    onChange={handleFormChange}
                                >
                                    <MenuItem value={1}>Ativo</MenuItem>
                                    <MenuItem value={0}>Inativo</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <FormControl>
                                <InputLabel>Fabricante</InputLabel>
                                <Select
                                    required
                                    name="manufacturerId"
                                    label="Fabricante"
                                    value={form.manufacturerId || ''}
                                    onChange={handleFormChange}
                                    sx={{ width: '148px' }}
                                >
                                    {
                                        manufacturers.map((item, index) => {
                                            return(
                                                <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel>Modelo</InputLabel>
                                <Select
                                    required
                                    name="modelId"
                                    label="Modelo"
                                    value={form.modelId}
                                    onChange={handleFormChange}
                                    sx={{ width: '148px' }}
                                >
                                    {
                                        models.map((model, index) => {
                                            if(model.manufacturer_id === form.manufacturerId){
                                                return(
                                                    <MenuItem value={model.id} key={index}>{model.name}</MenuItem>
                                                )
                                            }
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <TextField
                                type="number"
                                name="voalleId"
                                label="Ponto de acesso"
                                value={form.voalleId}
                                onChange={handleFormChange}
                                sx={{ m: 1, width: '200px' }}
                            />
                        </div>
                    </Inputs>
                </InputsWrapper>
                <InputsWrapper className="flex">
                    <h4>Configurações de Acesso</h4>
                    <Inputs>
                        <div className="ip-validation">
                            <TextField
                                required
                                name="host"
                                label="IP da OLT" 
                                value={form.host}
                                onBlur={handleMouseDownFormIp}
                                onChange={handleFormChange}
                                sx={{ width: '264px' }}
                            />
                            {

                                ipValid == null ? 
                                    <></> 
                                :
                                    ipValid ? 
                                    <CheckCircleOutlineIcon color="success"/>
                                    : 
                                    <HighlightOffIcon color="error"/>
                            }
                        </div>
                        <div className="flex">
                            <TextField 
                                name="telnetUser"
                                label="Usuário SSH/Telnet"
                                value={form.telnetUser}
                                onChange={handleFormChange}
                                sx={{ m: 1, width: '264px' }}
                            />
                            <FormControl sx={{ m: 1, width: '264px' }} variant="outlined">
                                <InputLabel>Senha SSH/Telnet</InputLabel>
                                <OutlinedInput
                                    name="telnetPassword"
                                    label="Senha SSH/Telnet" 
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.telnetPassword}
                                    onChange={handleFormChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>
                        <div className="flex">
                            <TextField 
                                name="geponUser"
                                label="Usuário GEPON"
                                value={form.geponUser}
                                onChange={handleFormChange}
                                sx={{ m: 1, width: '264px' }}
                            />
                            <FormControl sx={{ m: 1, width: '264px' }} variant="outlined">
                                <InputLabel>Senha GEPON</InputLabel>
                                <OutlinedInput
                                    name="geponPassword"
                                    label="Senha GEPON" 
                                    type={showGeponPassword ? 'text' : 'password'}
                                    value={form.geponPassword}
                                    onChange={handleFormChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={handleClickShowGeponPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showGeponPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '264px' }} variant="outlined">
                                <InputLabel>Senha enable GEPON</InputLabel>
                                <OutlinedInput
                                    name="geponEnablePassword"
                                    label="Senha enable GEPON" 
                                    type={showEnableGeponPassword ? 'text' : 'password'}
                                    value={form.geponEnablePassword}
                                    onChange={handleFormChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={handleClickShowEnableGeponPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showEnableGeponPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>
                    </Inputs>
                </InputsWrapper>
            </div>
            <VlanConfig className="flex">
                <h3>Mapeamento de VLAN's</h3>
                <div>
                    <aside>
                        <div className="actions flex">
                            <h4>AÇÕES</h4>
                            {
                                isModelChange && (
                                    <div className="form-wrapper flex">
                                        <div>
                                            <h5>Modelo de configuração de VLAN's</h5>
                                        </div>
                                        <form className="flex" onSubmit={handleGenerateConfig}>
                                            <TextField
                                                type="number"
                                                name="vlan"
                                                label="VLAN"
                                                value={form.vlan}
                                                onChange={handleFormChange}
                                                sx={{ width: '100px' }}
                                            />
                                            <FormControl sx={{ width: '180px' }}>
                                                <InputLabel>Configuração de VLAN</InputLabel>
                                                <Select
                                                    name='formatVlanConfig'
                                                    label="Configuração de VLAN"
                                                    value={form.formatVlanConfig}
                                                    onChange={handleFormChange}
                                                >
                                                    <MenuItem value={1}>Manual</MenuItem>
                                                    <MenuItem value={2}>vlan única</MenuItem>
                                                    <MenuItem value={3}>vlan {form.vlan} + pon</MenuItem>
                                                    <MenuItem value={4}>vlan {form.vlan} + placa</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Button variant="contained" color="success" size="small" type="submit">
                                                Aplicar
                                            </Button>
                                        </form>
                                    </div>
                                )
                            }
                            {
                                vlans.length > 0 && (
                                    <React.Fragment>
                                        <div className="form-wrapper flex">
                                            <div>
                                                <h5>Modificar VLAN por PLACA</h5>
                                            </div>
                                            <form className="flex" onSubmit={handleModifyVlan}>
                                                <FormControl sx={{ width: '100px' }}>
                                                    <InputLabel>Placa</InputLabel>
                                                    <Select
                                                        name='modifySlot'
                                                        label="Placa"
                                                        value={form.modifySlot}
                                                        onChange={handleFormChange}
                                                    >
                                                        {generateSlotOptions()}
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    required
                                                    type="number"
                                                    name="modifyVlan"
                                                    label="Nova VLAN"
                                                    value={form.modifyVlan}
                                                    onChange={handleFormChange}
                                                    sx={{ width: '100px' }}
                                                />
                                                <Button variant="contained" color="success" size="small" type="submit">
                                                    Aplicar
                                                </Button>
                                            </form>
                                        </div>
                                        <div className="form-wrapper flex">
                                            <div>
                                                <h5>Modificar N° da placa</h5>
                                            </div>
                                            <form className="flex" onSubmit={handleChangeSlotValue}>
                                                <FormControl sx={{ width: '100px' }}>
                                                    <InputLabel>Placa</InputLabel>
                                                    <Select
                                                        name='modifySlot'
                                                        label="Placa"
                                                        value={form.modifySlot}
                                                        onChange={handleFormChange}
                                                    >
                                                        {generateSlotOptions()}
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    required
                                                    type="number"
                                                    name="modifySlotNumber"
                                                    label="Novo Nº"
                                                    value={form.modifySlotNumber}
                                                    onChange={handleFormChange}
                                                    sx={{ width: '120px' }}
                                                />
                                                <Button variant="contained" color="success" size="small" type="submit">
                                                    Aplicar
                                                </Button>
                                            </form>
                                        </div>
                                        <div className="form-wrapper flex">
                                            <div>
                                                <h5>Modificar Perfil de VLAN por PLACA</h5>
                                            </div>
                                            <form className="flex" onSubmit={handleModifyProfileVlan}>
                                                <FormControl sx={{ width: '100px' }}>
                                                    <InputLabel>Placa</InputLabel>
                                                    <Select
                                                        name='modifySlot'
                                                        label="Placa"
                                                        value={form.modifySlot}
                                                        onChange={handleFormChange}
                                                    >
                                                        {generateSlotOptions()}
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    required
                                                    name="modifyProfileVlan"
                                                    label="Novo Perfil"
                                                    value={form.modifyProfileVlan}
                                                    onChange={handleFormChange}
                                                    sx={{ width: '200px' }}
                                                />
                                                <Button variant="contained" color="success" size="small" type="submit">
                                                    Aplicar
                                                </Button>
                                            </form>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        </div>
                    </aside>
                    <div className="table-wrapper flex">
                        {
                            vlans.length > 0 && (
                                <div className="table-controller">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Placa</th>
                                                <th>Pon</th>
                                                <th>Vlan</th>
                                                <th>Perfil de Vlan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                vlans.map((vlans, index) => {
                                                    return(
                                                        <tr key={index}>
                                                            <td>{vlans.slot}</td>
                                                            <td>{vlans.pon}</td>
                                                            <td>
                                                                <input 
                                                                    className="vlans"
                                                                    value={vlans.vlan || ''}
                                                                    onChange={handleChangeVlan(index)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    value={vlans.profile_vlan || ''}
                                                                    onChange={handleChangeProfileVlan(index)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    )   
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </div>
                </div>
            </VlanConfig>
        </OltStyledContainer>
    )
}