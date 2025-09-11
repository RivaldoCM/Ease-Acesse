import React, { useState } from "react";

import { useAuth } from "../../../../hooks/useAuth";
import { useResponse } from "../../../../hooks/useResponse";
import { updateUser } from "../../../../services/apiManageONU/updateUser";
import { isValidEmail } from "../../../../config/regex";

import { FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { NewUserWrapper } from "../style";
import { SelectChangeEvent } from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

type IEditUser = {
    open: boolean,
    selectedUser: {
        id: number,
        name: string,
        email: string,
        department_id: number,
        is_disabled: any
    } | null,
    handleClose: () => void
}

export function EditUser(props: IEditUser){
    const { user } = useAuth();
    const { setFetchResponseMessage } = useResponse();

    const [form, setForm] = useState<any>({
        id: props.selectedUser!.id,
        userName: props.selectedUser!.name,
        email: props.selectedUser!.email,
        accessLevel: props.selectedUser!.department_id,
        isDisabled: props.selectedUser!.is_disabled.toString() === 'false' ? false : true
    });
    console.log(form);
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleStatus = (e: SelectChangeEvent<string | number>) => {
        //ESSE CAPETA DESSE JAVASCRIPT QUE NÃO ENTENDE DIREITO
        if(e.target.value === 'true'){
            setForm({
                ...form,
                [e.target.name]: true
            });
        } else {
            setForm({
                ...form,
                [e.target.name]: false
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!form.email.match(isValidEmail)){
            setFetchResponseMessage('error/invalid-format-email');
        } else if(user!.rule <= props.selectedUser!.department_id && user?.rule !== 17 && user!.rule <= form.accessLevel){
            setFetchResponseMessage('error/privilege-denied');
        } else {
            const response = await updateUser({
                id: form.id,
                userName: form.userName,
                email: form.email,
                accessLevel: form.accessLevel,
                status: form.isDisabled
            });
            
            if(response){
                if(response.success){
                    props.handleClose();
                    setFetchResponseMessage(response.responses.status);
                } else {
                    setFetchResponseMessage(response.messages.message);
                }
            } else {
                setFetchResponseMessage('error/no-connection-with-API');
            }
        }
    }

    return(
        <Modal
            open={props.open}
            onClose={props.handleClose}
        >
            <NewUserWrapper onSubmit={handleSubmit}>
                <h3>EDITAR USUÁRIO</h3>
                <TextField
                    required
                    fullWidth
                    label="Nome"
                    name="userName"
                    value={form.userName}
                    onChange={handleFormChange}
                    sx={{ mt: 2 }}
                />
                <TextField
                    required
                    fullWidth
                    label="E-mail"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    sx={{ mt: 2 }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Nível de Acesso</InputLabel>
                    <Select
                        label="Nível de Acesso"
                        name="accessLevel"
                        value={form.accessLevel}
                        onChange={handleFormChange}
                    >
                        <MenuItem value={1}>Call Center</MenuItem>
                        <MenuItem value={3}>Supervisor Call Center</MenuItem>
                        <MenuItem value={10}>Tecnicos</MenuItem>
                        <MenuItem value={15}>Supervisor Tecnicos</MenuItem>
                        <MenuItem value={14}>NOC</MenuItem>
                        <MenuItem value={16}>CGR</MenuItem>
                        <MenuItem value={17}>Administrador</MenuItem>
                        <MenuItem value={2}>Consultoria</MenuItem>
                        <MenuItem value={4}>Faturamento</MenuItem>
                        <MenuItem value={5}>Supervisor Faturamento</MenuItem>
                        <MenuItem value={6}>Comercial</MenuItem>
                        <MenuItem value={7}>Supervisor Comercial</MenuItem>
                        <MenuItem value={8}>Loja</MenuItem>
                        <MenuItem value={9}>Supervisor Loja</MenuItem>
                        <MenuItem value={11}>Cobrança</MenuItem>
                        <MenuItem value={12}>Supervisor Cobrança</MenuItem>
                        <MenuItem value={13}>Retenção</MenuItem>
                        <MenuItem value={19}>Infra</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        label="Status"
                        name="isDisabled"
                        value={form.isDisabled}
                        onChange={handleStatus}
                    >
                        <MenuItem value="false">Ativado</MenuItem>
                        <MenuItem value="true">Desabilitado</MenuItem>
                    </Select>
                </FormControl>
                <div className="flex">
                    <IconButton color="success" type="submit">
                        <DoneIcon />
                    </IconButton>
                    <IconButton color="error" onClick={props.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </NewUserWrapper>
        </Modal>
    )
}