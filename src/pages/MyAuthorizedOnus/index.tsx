import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import { useAuth } from '../../hooks/useAuth';
import { useResponse } from '../../hooks/useResponse';
import { getOnuLogs } from '../../services/apiManageONU/getOnuLogs';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ResponsiveTable } from '../logs/onu/style';
import { TablePagination } from '@mui/material';
import { useSocket } from '../../hooks/useSocket';


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
                <TableCell align="center">{row.serial_onu}</TableCell>
                <TableCell align="center">{row.pppoe}</TableCell>
                <TableCell align="center">{row.rx_olt}</TableCell>
                <TableCell align="center">{row.rx_onu}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Ações
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function MyAuthorizedOnus() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const { setFetchResponseMessage } = useResponse();

    const [page, setPage] = useState(0);
    const [onu, setOnu] = useState<IOnuLogs[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        async function getData(){
            const response = await getOnuLogs({initialDate: dayjs().subtract(2, 'day').format('DD-MM-YYYY'), lastDate: dayjs().format('DD-MM-YYYY'), userId: user?.uid, state: 'true'});
            if(response){
                if(response.success){
                    setOnu(response.responses.response);
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
    }, []);

    if(socket){
        socket.emit('select_room', {
            uid: user?.uid,
            room: `/my_auth_onus/${user?.uid}`
        });
        socket.on('updateOnuData', data => {
            setOnu(data);
        });
    }

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

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
            <ResponsiveTable>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="center">Data</TableCell>
                            <TableCell align="center">Serial</TableCell>
                            <TableCell align="center">PPPoE</TableCell>
                            <TableCell align="center">Sinal recebido pela OLT(dBM)</TableCell>
                            <TableCell align="center">Sinal recebido pela ONU(dBM)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row, index) => (
                            <Row key={index} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </ResponsiveTable>
            <TablePagination
                rowsPerPageOptions={[10, 15, 25]}
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