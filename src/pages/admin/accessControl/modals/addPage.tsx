
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
    const [availablePages, setAvailablePages] = useState<any>([]);
    const [rules, setRules] = useState([]);
    const [openPage, setOpenPage] = useState(null);

    useEffect(() => {
        async function getData(){
            const getAvailablePages = getPages({});
            const getAvailableRules = getRules();

            const [pages, rules] = await Promise.all([getAvailablePages, getAvailableRules]);
            if(pages && pages.success){

                const onyPage = props.pages.map(item => item.pages).flat();
                const remainingPages = pages.responses.response.filter(item => !onyPage.find(inner => item.name === inner.name));
                setAvailablePages(remainingPages);
            }

            if(rules && rules.success){
                setRules(rules.responses.response);
            }

        }
        getData();
    }, [])

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
                                        <input type="checkbox" /> {page.name}
                                    </label>
                                    <div>
                                        {openPage === page.id ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
                                    </div>
                                </div>
                                <AccordionContent open={openPage === page.id}>
                                    {rules.map((rule, idx) => (
                                        <label key={idx}>
                                            <input type="checkbox" /> {rule.name}
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
