import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

type EditUserPropsLocal = {
    open: boolean;
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
                    sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                    teste
                </Sheet>
            </Modal>
        </React.Fragment>
    );
}
