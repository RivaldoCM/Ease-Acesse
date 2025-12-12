import React, { useEffect, useState } from 'react';

import { Pages } from '../../../../components/Pages';

import { getCities } from '../../../../services/apiManageONU/getCities';
import { ICities } from '../../../../interfaces/ICities';
import { getUsers } from '../../../../services/apiManageONU/getUsers';

import { IUsers } from '../../../../interfaces/IUsers';
import { IPageCollection } from '../../../../interfaces/IPages';

import { EditUserModal } from '../style';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { FormControl, FormLabel, IconButton, Input, Option, Select } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import Sheet from '@mui/joy/Sheet';

type EditUserPropsLocal = {
    open: boolean;
    user: IUsers;
    departments: IDepartments[];
    handleClose: () => void;
}

export function EditUser(props: EditUserPropsLocal){
    const [cities, setCities] = useState<ICities[]>([]);
    const [overrideRules, setOverrideRules] = useState<IPageCollection[]>([]);
    const [user, setUser] = useState<IUsers>({
        id: props.user.id,
        name: props.user.name,
        email: props.user.email,
        department_id: props.user.department_id,
        password: '',
        is_disabled: props.user.is_disabled,
        Role: {
            id: props.user.Role.id,
            name: props.user.Role.name,
        }
    });

    useEffect(() => {
        async function fetchData() {
            const getCity = getCities();
            const getOverrideRules = getUsers({userId: props.user.id});
            const [cities, userOverrideRules] = await Promise.all([getCity, getOverrideRules]);

            if(cities && cities.success){
                setCities(cities.responses.response);
            }

            if(userOverrideRules && userOverrideRules.success){
                setOverrideRules(userOverrideRules.responses.response);
            }
        }
        fetchData();
    }, []);

    const handleUserChange = (e: any) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    return (
        <React.Fragment>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{ borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                    <EditUserModal>
                        <div>
                            <IconButton variant="outlined" size='sm' onClick={props.handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div>
                            <div className='flex'>
                                <FormControl sx={{maxWidth: 300}}>
                                    <FormLabel>Nome do usuário</FormLabel>
                                    <Input value={props.user?.name}/>
                                </FormControl>
                                <FormControl sx={{maxWidth: 300}}>
                                    <FormLabel>Email</FormLabel>
                                    <Input value={user.email} name='Email' onChange={handleUserChange} />
                                </FormControl>
                            </div>
                            <div className='flex'>
                                <FormControl sx={{maxWidth: 300}}>
                                    <FormLabel>
                                        Departamento
                                    </FormLabel>
                                    <Select value={props.user.department_id}>
                                        {
                                            props.departments.map((department, index) => (
                                                <Option value={department.id} key={index}>{department.name}</Option>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <FormControl sx={{maxWidth: 300}}>
                                    <FormLabel>
                                        Cargo
                                    </FormLabel>
                                    <Select value={props.user.Role.id}>
                                        {
                                            props.departments.find(department => department.id === props.user.department_id)!.Roles.map((role, index) => (
                                                <Option value={role.id} key={index}>{role.name}</Option>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='flex'>
                                <FormControl sx={{width: 300}}>
                                    <FormLabel>
                                        Cidade
                                    </FormLabel>
                                    <Select value={true}>
                                        {
                                            cities.map((city, index) => (
                                                <Option value={city.id} key={index}>{city.name}</Option>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <FormControl sx={{width: 300}}>
                                    <FormLabel>
                                        Status
                                    </FormLabel>
                                    <Select value={user.is_disabled} name="is_disabled" onChange={handleUserChange}>
                                        <Option value={true}>Ativo</Option>
                                        <Option value={false}>Inativo</Option>
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <div className='flex'>
                                    <p>REGRAS PERSONALIZADAS</p>
                                    <IconButton variant="soft" color="success">
                                        <AddIcon />
                                    </IconButton>
                                </div>
                                {
                                    overrideRules.length > 0 &&
                                    <div className="flex override">
                                        <Pages pages={overrideRules} />
                                    </div>
                                }
                            </div>
                            <div>
                                <Button endDecorator={<CheckIcon />} variant='solid' color="success" size='sm'>
                                    Finalizar edição
                                </Button>
                            </div>
                        </div>
                    </EditUserModal>
                </Sheet>
            </Modal>
        </React.Fragment>
    );
}
