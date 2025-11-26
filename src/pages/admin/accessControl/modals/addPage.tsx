
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { AccordionContent, AddPageModal } from '../style';
import React, { useEffect, useState } from 'react';
import { Box, Checkbox, checkboxClasses, IconButton } from '@mui/joy';
import { getRules } from '../../../../services/apiManageONU/getRules';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { IPageCollection } from '../../../../interfaces/IPages';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { getPages } from '../../../../services/apiManageONU/pages';

type AddPagePropsLocal = {
    open: boolean;
    pages: IPageCollection[];
    departmentId: number | undefined;
    handleClose: () => void;
}

export function AddPage(props: AddPagePropsLocal){
    const [availablePages, setAvailablePages] = useState<{id: number, name: string}[]>([]);
    const [rules, setRules] = useState<IRules[]>([]);
    const [openPage, setOpenPage] = useState<number | null>(null);

    const [newPages, setNewPages] = useState<{page_id: number, rule_id: number}[]>([]);

    useEffect(() => {
        async function getData(){
            const getAvailablePages = getPages({});
            const getAvailableRules = getRules();

            const [pages, rules] = await Promise.all([getAvailablePages, getAvailableRules]);
            if(pages && pages.success){
                const onyPage = props.pages.map(item => item.pages).flat(); //RETORNA SOMENTE DADOS DAS PAGES EM SI, SEM CATEGORIA E ETC.
                const remainingPages = pages.responses.response.filter(item => !onyPage.find(inner => item.name === inner.name)); //SUBTRAI AS PAGES JA ADICIONADAS
                setAvailablePages(remainingPages);
            }

            if(rules && rules.success){
                setRules(rules.responses.response);
            }
        }
        getData();
    }, []);

    const handleCheckboxClick = ({pageId, ruleId}:{pageId?: number, ruleId?: number}) => {
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

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(newPages)
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
                    sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                    <AddPageModal onSubmit={handleSubmit}>
                        <div className='flex'>
                            <IconButton variant="outlined" onClick={props.handleClose}>
                                <CloseOutlinedIcon />
                            </IconButton>
                        </div>
                        <div>
                            {availablePages.map((page) => (
                                <div key={page.id}>
                                    <div onClick={() => setOpenPage(openPage === page.id ? null : page.id)}>
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                onClick={() =>  handleCheckboxClick({pageId: page.id})} 
                                                checked={newPages.some((item) => item.page_id === page.id)}
                                            /> 
                                                {page.name}
                                        </label>
                                        <div>
                                            {openPage === page.id ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
                                        </div>
                                    </div>
                                    <AccordionContent open={openPage === page.id}>
                                        {rules.map((rule, idx) => (
                                            <label key={idx}>
                                                <input 
                                                    type="checkbox" 
                                                    onClick={() => handleCheckboxClick({pageId: page.id,ruleId: rule.id})} 
                                                    checked={newPages.some((item) => item.page_id === page.id && item.rule_id === rule.id)} 
                                                /> 
                                                {rule.name}
                                            </label>
                                        ))}
                                    </AccordionContent>
                                </div>
                            ))}
                        </div>
                        <div className='flex'>
                            <Button startDecorator={<CheckOutlinedIcon />} color='success' type='submit'>
                                Finalizar
                            </Button>
                        </div>
                    </AddPageModal>
                </Sheet>
            </Modal>
        </React.Fragment>
    );
}
