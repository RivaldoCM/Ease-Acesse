import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';

import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';

import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { IPageCollection } from '../../../interfaces/IPages';

type AddPagePropsLocal = {
    open: boolean;
    page: IPageCollection["pages"][number]
    handleClose: () => void;
}

export function RemovePage(props: AddPagePropsLocal){
    return (
        <React.Fragment>
            <Modal open={props.open}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRoundedIcon />
                        Confirmation
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        Tem certeza que deseja remover a página "{props.page.name}"?
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="danger" >
                            Remover
                        </Button>
                        <Button variant="plain" color="neutral" onClick={props.handleClose}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
