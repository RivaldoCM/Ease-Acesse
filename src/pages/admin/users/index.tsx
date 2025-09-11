import React, { useState, useEffect, useMemo } from 'react';

import { useAuth } from '../../../hooks/useAuth';
import { useSocket } from '../../../hooks/useSocket';
import { useResponse } from '../../../hooks/useResponse';

import { IUsers } from '../../../interfaces/IUsers';

import { getUsers } from '../../../services/apiManageONU/getUsers';

import { EnhancedTableHead, EnhancedTableToolbar } from './table';
import { NewUser } from './modals/newUser';
import { EditUser } from './modals/editUser';
import { EditPassword } from './modals/editPassword';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function stableSort<T>(array: readonly T[]) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const renderDepartment = (args: number) => {
    switch(args){
        case 1:
            return <TableCell align="right">CallCenter</TableCell>
        case 2:
            return <TableCell align="right">Consultoria</TableCell>
        case 3:
            return <TableCell align="right">Supervisor Call Center</TableCell>
        case 4:
            return <TableCell align="right">Faturamento</TableCell>
        case 5:
            return <TableCell align="right">Supervisor Faturamento</TableCell>
        case 6:
            return <TableCell align="right">Comercial</TableCell>
        case 7:
            return <TableCell align="right">Supervisor Comercial</TableCell>
        case 8:
            return <TableCell align="right">Loja</TableCell>
        case 9:
            return <TableCell align="right">Supervisor Loja</TableCell>
        case 10:
            return <TableCell align="right">Tecnicos</TableCell>
        case 11:
            return <TableCell align="right">Cobrança</TableCell>
        case 12:
            return <TableCell align="right">Supervisor Cobrança</TableCell>
        case 13:
            return <TableCell align="right">Retenção</TableCell>
        case 14:
            return <TableCell align="right">NOC</TableCell>
        case 15:
            return <TableCell align="right">Supervisor Tecnicos</TableCell>
        case 16:
            return <TableCell align="right">CGR</TableCell>
        case 17:
            return <TableCell align="right">Administrador</TableCell>
        case 18:
            return <TableCell align="right">Infra</TableCell>
        default:
            return <TableCell align="right">Outros</TableCell>
    }
}

export function Users(){
    const { user } = useAuth();
    const { socket } = useSocket();
    const { setFetchResponseMessage } = useResponse();

    const [users, setUsers] = useState<IUsers[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUsers | null>(null);
    const [filteredUser, setFilteredUser] = useState<IUsers[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState<number[]>([]);
    const [dense, setDense] = useState(false);
    const [openNewserModal, setOpenNewUserModal] = useState(false);
    const [openEditUserModal, setOpenEditUserModal] = useState(false);
    const [openEditPasswordModal, setOpenEditPasswordModal] = useState(false);

    useEffect(() => {
        async function users(){
            const response = await getUsers();
            if(response){
                if(response.success){
                    setUsers(response.responses.response);
                    setFilteredUser(response.responses.response);
                } else {
                    setUsers([]);
                    setFetchResponseMessage(response.messages.message);
                }
            } else {
                setFetchResponseMessage('error/no-connection-with-API');
            }
        }
        users();
    }, []);

    if(socket){
        socket.emit('select_room', {
            uid: user?.uid,
            room: '/users'
        });
        socket.on('update-users', data => {
            setFilteredUser(data);
        });
    }

    const handleSearchValueChange = (value: string) => {
        const filteredUser = users.filter((el) => {
            if(el.name.toLowerCase().startsWith(value.toLowerCase())){
                setPage(0);
                return el;
            }
        })
        setFilteredUser(filteredUser);
    }

    const handleClick = (_event: React.MouseEvent<unknown>, id: number, row: IUsers) => {
        setSelectedUser(row);
    
        if(selected[0] === id){
            //Aqui eu desmarco a checkbox caso clique no usuário que já esta marcado
            setSelected([]);
            return;
        }
        setSelected([id]);
    };

    const handleChangePage = (_event: unknown, newPage: number) => { setPage(newPage); };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => { setDense(event.target.checked); };
    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (page) * rowsPerPage - filteredUser.length) : 0;
    const visibleRows = useMemo(() => 
        stableSort(filteredUser).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        ),
        [page, rowsPerPage, filteredUser]
    );

    const handleOpenNewUserModal = () => setOpenNewUserModal(true);
    const handleCloseNewUserModal = () => setOpenNewUserModal(false)
    const handleOpenEditUserModal = () => setOpenEditUserModal(true);
    const handleCloseEditUserModal = () => setOpenEditUserModal(false);
    const handleOpenEditPasswordModal = () => setOpenEditPasswordModal(true);
    const handleCloseEditPasswordModal = () => setOpenEditPasswordModal(false);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected.length} 
                    onOpenNewUserModal={handleOpenNewUserModal}
                    onOpenEditUserModal={handleOpenEditUserModal}
                    onOpenEditPasswordModal={handleOpenEditPasswordModal}
                    onInputValueChange={handleSearchValueChange}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead />
                        <TableBody>
                        {typeof visibleRows !== 'string' && visibleRows.map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleClick(event, row.id, row)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                    >
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.email}</TableCell>
                                    {renderDepartment(row.department_id)}
                                    <TableCell align="right">
                                        {row.is_disabled ? 'Desabilitado' : 'Habilitado'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: (dense ? 33 : 53) * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 15, 25]}
                    component="div"
                    count={filteredUser.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                sx={{margin: '0'}}
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Modo compacto"
            />
            {
                openNewserModal && (
                    <NewUser
                        open={openNewserModal}
                        handleClose={handleCloseNewUserModal}
                    />
                )
            }
            {
                openEditUserModal && (
                    <EditUser 
                        open={openEditUserModal}
                        handleClose={handleCloseEditUserModal}
                        selectedUser={selectedUser}
                    />
                )
            }
            {
                openEditPasswordModal && (
                    <EditPassword 
                        open={openEditPasswordModal}
                        handleClose={handleCloseEditPasswordModal}
                        selectedUser={selectedUser}
                    />
                )
            }
        </Box>
    );
}