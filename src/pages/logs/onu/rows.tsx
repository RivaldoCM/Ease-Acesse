import React, { useEffect, useMemo, useState } from 'react';

import { useResponse } from '../../../hooks/useResponse';
import { useLoading } from '../../../hooks/useLoading';

import { getPeopleId } from '../../../services/apiVoalle/getPeopleId';
import { getConnectionId } from '../../../services/apiManageONU/getConnectionId';
import { updateConnection } from '../../../services/apiVoalle/updateConnection';
import { getOnuInfo } from '../../../services/apiManageONU/getOnuInfo';
import { updateLogsOnu } from '../../../services/apiManageONU/updateLogOnu';
import { getOnuLogs } from '../../../services/apiManageONU/getOnuLogs';

import { FilterOptions } from './filterOptions';

import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ResponsiveTable, TableInsideTable, WrapRow } from './style';
import { CircularProgress, TablePagination } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import Input from '@mui/joy/Input';

export function RowLogsOnu(props: IOnuLogsProps) {
    const { row } = props;
    const { isLoading, startLoading, stopLoading } = useLoading();

    const [open, setOpen] = useState(false);
    const [clientData, setClientData] = useState<any>({
        cpf: row.cpf || '',
        pppoe: row.pppoe || '',
        name: '',
        peopleId: null,
        contractId: null,
        connectionId: null,
        pppoePassword: '',
        fakeUp: false,
        teste: 0
    });

    //ATUALIZA DADOS DE CPF E PPPOE CASO EDITADOS
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientData({
            ...clientData,
            [e.target.name]: e.target.value,
        });
    }

    //CONTROLA A ATUALIZAÇÃO DO CPF E PPPOE A CADA ABERTURA OU FECHAMENTO DO WRAP
    const handleControllWrapRow = (row: any) => {
        setOpen(!open);
        setClientData({
            ...clientData,
            cpf: row.cpf,
            pppoe: row.pppoe,
        });
    }

    const handleUpdateConnection = async (row: any) => {
        startLoading();
        const peopleData = await getPeopleId(clientData.cpf);
        if(peopleData){
            setClientData({
                ...clientData,
                name: peopleData.name,
                peopleId: peopleData.id,
            });

            const connectionData = await getConnectionId(clientData.cpf, peopleData.id, clientData.pppoe);
            if(connectionData && connectionData.success){
                setClientData({
                    ...clientData,
                    name: peopleData.name,
                    peopleId: peopleData.id,
                    contractId: connectionData.responses.response.contractId,
                    pppoePassword: connectionData.responses.response.password
                });
            } else {
                stopLoading();
                return;
            }

            const onu = await getOnuInfo({oltId: row.Olts.id, serialNumber: row.serial_onu});
            const update = await updateConnection({
                onuId: onu.success ? onu.responses.response.id : 0,
                connectionId: connectionData.responses.response.connectionId,
                pppoeUser: clientData.pppoe,
                pppoePassword: connectionData.responses.response.password,
                slot: row.slot,
                pon: row.pon,
                serialNumber: row.serial_onu,
                modelOlt: onu.success && onu.responses.response.modelOlt,
                accessPointId: row.Olts.voalle_id,
            });

            if(update){
                //NAO SEI PQ PRECISO REECREVER OS DADOS, O SPREAD(...) NAO ESTÁ FUNCIONANDO
                setClientData({
                    ...clientData,
                    name: peopleData.name,
                    peopleId: peopleData.id,
                    connectionId: connectionData.responses.response.connectionId,
                    contractId: connectionData.responses.response.contractId,
                    pppoePassword: connectionData.responses.response.password,
                    fakeUp: true,
                    rowId: row.id
                });
                await updateLogsOnu({id: row.id, isUpdated: true});
            }
            stopLoading();
        } else {
            stopLoading();
            return;
        }
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleControllWrapRow(row)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center">{row.created_at}</TableCell>
                <TableCell component="th" scope="row">
                    {row.User.name}
                </TableCell>
                <TableCell align="center">{row.Cities.name}</TableCell>
                <TableCell align="center">{row.serial_onu}</TableCell>
                <TableCell align="center">{row.pppoe}</TableCell>
                <TableCell align="center">{row.rx_olt}</TableCell>
                <TableCell align="center">{row.rx_onu}</TableCell>
                <TableCell align="center">
                    {
                        row.is_auth ?
                            row.is_updated || clientData.fakeUp && clientData.rowId === row.id ? 
                                <CheckCircleOutlineIcon color='success' /> 
                                : 
                                <HighlightOffIcon color='error' />
                            :
                        <></>
                    }
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                    <WrapRow>
                    <Collapse in={open}>
                        {
                            row.is_auth && !row.is_updated && (
                                <TableInsideTable>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>CPF</th>
                                                <th>PPPoE</th>
                                                <th>Nome</th>
                                                <th>ID Pessoas Completo</th>
                                                <th>ID Contrato</th>
                                                <th>ID Conexão</th>
                                                <th>Atualizar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Input
                                                        name='cpf'
                                                        size='sm'
                                                        sx={{ width: 150, m: '0 auto' }}
                                                        value={clientData.cpf}
                                                        onChange={handleChangeInput}
                                                    />
                                                </td>
                                                <td>
                                                    <Input 
                                                        name='pppoe'
                                                        size='sm'
                                                        sx={{ width: 150, m: '0 auto' }}
                                                        value={clientData.pppoe}
                                                        onChange={handleChangeInput}
                                                    />
                                                </td>
                                                <td>
                                                    {
                                                        (isLoading && !clientData.name? 
                                                            <CircularProgress color="primary" size={15} /> 
                                                        :
                                                            (!clientData.name ? 
                                                                <HighlightOffIcon fontSize='small'/> 
                                                            : 
                                                                clientData.name
                                                            )
                                                        )
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        (isLoading && !clientData.peopleId?
                                                            <CircularProgress color="primary" size={15} /> 
                                                        :
                                                            (!clientData.peopleId ? 
                                                                <HighlightOffIcon fontSize='small'/> 
                                                            : 
                                                                clientData.peopleId
                                                            )
                                                        )
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        (isLoading && !clientData.contractId? 
                                                            <CircularProgress color="primary" size={15} /> 
                                                        :
                                                            (!clientData.contractId ? 
                                                                <HighlightOffIcon fontSize='small'/> 
                                                            : 
                                                                clientData.contractId
                                                            )
                                                        )
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        (isLoading && !clientData.connectionId? 
                                                            <CircularProgress color="primary" size={15} /> 
                                                        :
                                                            (!clientData.connectionId ? 
                                                                <HighlightOffIcon fontSize='small' /> 
                                                            : 
                                                                clientData.connectionId
                                                            )
                                                        )
                                                    }
                                                </td>
                                                <td>
                                                    <IconButton 
                                                        disabled={isLoading ? true : false}
                                                        onClick={() => handleUpdateConnection(row)}
                                                        color="primary" 
                                                    >
                                                        <UpdateOutlinedIcon fontSize='small' />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </TableInsideTable>
                            )
                        }
                        <TableInsideTable>
                            <table>
                                <thead>
                                    <tr>
                                        <th>OLT</th>
                                        <th>Placa</th>
                                        <th>Pon</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {row.Olts.name}
                                        </td>
                                        <td>{row.slot}</td>
                                        <td>{row.pon}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </TableInsideTable>
                    </Collapse>
                    </WrapRow>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}