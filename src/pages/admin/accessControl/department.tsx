import React from "react";

import { Pages } from "../../../components/Pages";

import { IPageCollection } from "../../../interfaces/IPages";

import AddIcon from '@mui/icons-material/Add';
import { FormControl, FormLabel, IconButton, Input, Option, Select} from "@mui/joy";

export function Department(props: any){
    return (
        <React.Fragment>
            <div className="config">
                <h3>Departamento {props.department.name}</h3>
                <div>
                    <FormControl sx={{ width: 248 }}>
                        <FormLabel>Nome do departamento</FormLabel>
                        <Input placeholder={props.department.name} />
                    </FormControl>
                </div>
                <div>
                    <FormControl sx={{ width: 148 }}>
                        <FormLabel>
                            Status
                        </FormLabel>
                        <Select value={props.department.status}>
                            <Option value={true}>Ativo</Option>
                            <Option value={false}>Inativo</Option>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="pages">
                <div className="flex">
                    <h3>Páginas disponíveis</h3>
                    <IconButton variant="soft" color="success" onClick={props.onOpenPage}>
                        <AddIcon />
                    </IconButton>
                </div>
                <Pages pages={props.pages as IPageCollection[]} />
            </div>
        </React.Fragment>
    )
}