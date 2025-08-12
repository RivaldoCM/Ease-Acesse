import React, { useEffect, useMemo, useState } from 'react';

import { FilterOptions } from './filterOptions';
import { RowLogsOnu } from './rows';

import { useResponse } from '../../../hooks/useResponse';

import { getOnuLogs } from '../../../services/apiManageONU/getOnuLogs';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ResponsiveTable } from './style';
import { TablePagination } from '@mui/material';


function stableSort<T>(array: readonly T[]) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
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
                <FilterOptions onFilterChange={handleFilterChange} />
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
                                <RowLogsOnu key={index} row={row} />
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