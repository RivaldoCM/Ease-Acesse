import { useEffect, useState } from "react";
import { CardDepartment, Container, Header, Nav, Status, View } from "./style";
import { getDepartments } from "../../../services/apiManageONU/getDepartments";
import { Box, FormControl, FormLabel, IconButton, Input, Option, Select, Sheet, Table, Typography } from "@mui/joy";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { getUsers } from "../../../services/apiManageONU/getUsers";
import { EnhancedTableHead, EnhancedTableToolbar, labelDisplayedRows } from "./table";

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddIcon from '@mui/icons-material/Add';
import { AddPage } from "./modals/addPage";
import { EditUser } from "./modals/editUser";
import { IPageCollection } from "../../../interfaces/IPages";
import { IUsers } from "../../../interfaces/IUsers";
import { Pages } from "../../../components/Pages";
import { getPages } from "../../../services/apiManageONU/pages";
import { useSocket } from "../../../hooks/useSocket";
import { useAuth } from "../../../hooks/useAuth";

export function Role(props: any){

    return (
        <>
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
                    <IconButton variant="soft" color="success" >
                        <AddIcon />
                    </IconButton>
                </div>
                <Pages pages={props.pages && props.pages as IPageCollection[]} />
            </div>
        </>
    )
}