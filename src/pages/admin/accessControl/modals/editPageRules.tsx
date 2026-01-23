import React, { useEffect, useState } from 'react';

import { Pages } from '../../../../components/Pages';

import { getCities } from '../../../../services/apiManageONU/getCities';
import { ICities } from '../../../../interfaces/ICities';
import { getUsers } from '../../../../services/apiManageONU/getUsers';

import { IUsers } from '../../../../interfaces/IUsers';
import { IPageCollection } from '../../../../interfaces/IPages';

import { AccordionContent, AddPageModal, EditPageModal, EditUserModal } from '../style';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { FormControl, FormLabel, IconButton, Input, Option, Select } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import Sheet from '@mui/joy/Sheet';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

type EditUserPropsLocal = {
    open: boolean;
    user: IUsers;
    departments: IDepartments[];
    handleClose: () => void;
}

export function EditPageRules(props: any){
    const [rules, setRules] = useState<IRules[]>([]);
    const [openPage, setOpenPage] = useState<number | null>(null);

    const [newPages, setNewPages] = useState<{page_id: number, rule_id: number, department_id?: number}[]>([]);
    
    const handleChangeCheckBox = ({pageId, ruleId}:{pageId?: number, ruleId?: number}) => {
        if(pageId && ruleId){
            //CLICK NA CHECKBOX DE RULES E VERIFICA SE JA TEM OS DADOS ADICIONADA
            if(newPages.find(item => item.page_id === pageId && item.rule_id === ruleId)){
                //SE TIVER, REMOVE
                setNewPages(newPages.filter(item => !(item.page_id === pageId && item.rule_id === ruleId)));
            } else {
                //SE NAO TIVER, ADICIONA
                setNewPages([...newPages,{page_id: pageId, rule_id: ruleId, department_id: props.departmentId}]);
            }
        } else {
            //CLICK NA CHECKBOX DE PAGES
            if(newPages.find(item => item.page_id === pageId)){
                //SE TIVER, REMOVE TODOS OS ITENS COM ESSE PAGEID
                setNewPages(newPages.filter(item => !(item.page_id === pageId)));
            }
        }
    }
    console.log(props.page)
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
                    <EditPageModal>
                        <div className='flex'>
                            <IconButton variant="outlined" onClick={props.handleClose}>
                                <CloseOutlinedIcon />
                            </IconButton>
                        </div>
                        <div>
                            <div>
                                <label>
                                    {props.page.name}
                                </label>

                                <AccordionContent open={openPage}>
                                    {props.page.Rules.map((rule, idx) => (
                                        <label key={idx}>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleChangeCheckBox({pageId: props.page.id,ruleId: rule.id})} 
                                                checked={newPages.some((item) => item.page_id === props.page.id && item.rule_id === rule.id)} 
                                            />
                                            {rule.name}
                                        </label>
                                    ))}
                                </AccordionContent>
                            </div>
                        </div>
                        <div className='flex'>
                            <Button endDecorator={<CheckOutlinedIcon />} color='success' type='submit'>
                                Finalizar
                            </Button>
                        </div>
                    </EditPageModal>
                </Sheet>
            </Modal>
        </React.Fragment>
    );
}
