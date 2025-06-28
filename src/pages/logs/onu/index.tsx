import React, { useEffect, useMemo, useState } from 'react';

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
import { ResponsiveTable, TableInsideTable } from './style';
import { TablePagination } from '@mui/material';
import { useResponse } from '../../../hooks/useResponse';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function stableSort<T>(array: readonly T[]) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function Row(props: IOnuLogsProps) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
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
                            row.is_updated ? 
                                <CheckCircleOutlineIcon color='success'/> 
                                : 
                                <HighlightOffIcon color='error'/>
                            : 
                        <></>
                    }
                    </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                    <Collapse in={open}unmountOnExit>
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
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function LogsOnu() {
    const { setFetchResponseMessage } = useResponse();

    const [page, setPage] = useState(0);
    const [onu, setOnu] = useState<IOnuLogs[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterParams, setFilterParams] = useState<any>();

    useEffect(() => {
        async function getData(){
            const data = await getOnuLogs(filterParams);
            if(data){
                if(data.success){
                    data.responses.response && setOnu(data.responses.response);

                    setPage(0);
                } else {
                    setOnu([]);
                }
            } else {
                setFetchResponseMessage('error/no-connection-with-API');
                setOnu([]);
            }
        };
        getData();
    }, [filterParams]);
    console.log(onu)
    const visibleRows = useMemo(() => 
        stableSort(onu).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        ), [page, rowsPerPage, onu]
    );

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangePage = (_event: unknown, newPage: number) => { setPage(newPage); };
    const handleFilterChange = (filter: IFilterOnuLogs | null) => {
        setFilterParams(filter);
    };

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <FilterOptions onFilterChange={handleFilterChange}/>
                <ResponsiveTable>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell align="center">Data</TableCell>
                                <TableCell align="center">Tecnico</TableCell>
                                <TableCell align="center" sx={{width: 150}}>Cidade</TableCell>
                                <TableCell align="center">Serial</TableCell>
                                <TableCell align="center">PPPoE</TableCell>
                                <TableCell align="center">Sinal recebido pela OLT(dBM)</TableCell>
                                <TableCell align="center">Sinal recebido pela ONU(dBM)</TableCell>
                                <TableCell align="center">Atualizado no Voalle</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows && visibleRows.map((row, index) => (
                                <Row key={index} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </ResponsiveTable>
                <TablePagination
                    rowsPerPageOptions={[10, 15, 25, 50]}
                    component="div"
                    count={onu.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </React.Fragment>
    );
}