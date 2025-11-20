import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { IUsers } from '../../../../interfaces/IUsers';
import { ModalContent } from '../style';
import { FormControl, FormLabel, IconButton, Input, Option, Select } from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

type EditUserPropsLocal = {
    open: boolean;
    user: IUsers | null;
    handleClose: () => void;
}

export function EditUser(props: EditUserPropsLocal){
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
                    <ModalContent>
                        <div>
                            <IconButton variant="outlined">
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div>
                            <div className='flex'>
                                <FormControl sx={{maxWidth: 300}}>
                                    <FormLabel>Nome do usuário</FormLabel>
                                    <Input />
                                </FormControl>
                                <FormControl sx={{maxWidth: 300}}>
                                    <FormLabel>Email</FormLabel>
                                    <Input />
                                </FormControl>
                            </div>
                            <div className='flex'>
                                <FormControl sx={{maxWidth: 300}}>
                                    <FormLabel>Departamento</FormLabel>
                                    <Input />
                                </FormControl>
                                <FormControl sx={{maxWidth: 300}}>
                                    <FormLabel>Cargo</FormLabel>
                                    <Input />
                                </FormControl>
                            </div>
                            <div className='flex'>
                                <FormControl sx={{maxWidth: 300}}>
                                    <FormLabel>
                                        Cidade
                                    </FormLabel>
                                    <Select value={true}>
                                        <Option value={true}>Ativo</Option>
                                        <Option value={false}>Inativo</Option>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{width: 300}}>
                                    <FormLabel>
                                        Status
                                    </FormLabel>
                                    <Select value={true}>
                                        <Option value={true}>Ativo</Option>
                                        <Option value={false}>Inativo</Option>
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <p>REGRAS PERSONALIZADAS</p>
                                <div>renderizar as paginas caso tenha</div>
                            </div>
                            <div>
                                <Button endDecorator={<CheckIcon />} variant='solid' color="success" size='sm'>
                                    Finalizar edição
                                </Button>
                            </div>
                        </div>
                    </ModalContent>
                </Sheet>
            </Modal>
        </React.Fragment>
    );
}
