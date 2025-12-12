import React, { useEffect, useState } from "react";

import { Pages } from "../../../components/Pages";

import { IPageCollection } from "../../../interfaces/IPages";

import AddIcon from '@mui/icons-material/Add';
import { FormControl, FormLabel, IconButton, Input, Option, Select } from "@mui/joy";

export function Role(props: any){
    return(
        <React.Fragment>
            <div className="config">
                <h3>Cargo {props.role && props.role.name}</h3>
                <div>
                    <FormControl>
                        <FormLabel>Nome do Cargo</FormLabel>
                        <Input placeholder={props.role && props.role.name} />
                    </FormControl>
                </div>
                <div>
                    <FormControl sx={{ width: 240 }}>
                        <FormLabel>
                            Status
                        </FormLabel>
                        <Select value={props.role && props.role.status}>
                            <Option value={true}>Ativo</Option>
                            <Option value={false}>Inativo</Option>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="pages">
                <div className="flex">
                    <h3>Páginas disponíveis</h3>
                    <IconButton variant="soft" color="success">
                        <AddIcon />
                    </IconButton>
                </div>
                <Pages pages={props.pages && props.pages as IPageCollection[]} />
            </div>
        </React.Fragment>
    )
}