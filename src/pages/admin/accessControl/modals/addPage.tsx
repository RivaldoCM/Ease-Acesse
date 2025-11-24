
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { AccordionContent, AddPageModal } from '../style';
import React, { useEffect, useState } from 'react';
import { getPages } from '../../../../services/apiManageONU/getPages';
import { Box, Checkbox, checkboxClasses } from '@mui/joy';
import { getRules } from '../../../../services/apiManageONU/getRules';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { IPageCollection } from '../../../../interfaces/IPages';

type AddPagePropsLocal = {
    open: boolean;
    pages: IPageCollection[];
    handleClose: () => void;
}

export function AddPage(props: AddPagePropsLocal){
    const [availablePages, setAvailablePages] = useState<{id: number, name: string}[]>([]);
    const [rules, setRules] = useState<IRules[]>([]);
    const [openPage, setOpenPage] = useState<number | null>(null);

    const [newPages, setNewPages] = useState<{pageId: number, ruleId: number}[]>([]);

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
            if(newPages.find(item => item.pageId === pageId && item.ruleId === ruleId)){
                //SE TIVER, REMOVE
                setNewPages(newPages.filter(item => !(item.pageId === pageId && item.ruleId === ruleId)));
            } else {
                //SE NAO TIVER, ADICIONA
                setNewPages([...newPages,{pageId: pageId, ruleId: ruleId}]);
            }
        } else {
            //CLICK NA CHECKBOX DE PAGES
            if(newPages.find(item => item.pageId === pageId)){
                //SE TIVER, REMOVE TODOS OS ITENS COM ESSE PAGEID
                setNewPages(newPages.filter(item => !(item.pageId === pageId)));
            }
        }
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
                    <AddPageModal>
                        {availablePages.map((page) => (
                            <div key={page.id}>
                                <div onClick={() => setOpenPage(openPage === page.id ? null : page.id)}>
                                    <label>
                                        <input type="checkbox" onClick={() =>  handleCheckboxClick({pageId: page.id})} checked={newPages.some((item) => item.pageId === page.id)}/> {page.name}
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
                                                checked={newPages.some((item) => item.pageId === page.id && item.ruleId === rule.id)} 
                                            /> 
                                            {rule.name}
                                        </label>
                                    ))}
                                </AccordionContent>
                            </div>
                        ))}
                    </AddPageModal>
                </Sheet>
            </Modal>
        </React.Fragment>
    );
}
