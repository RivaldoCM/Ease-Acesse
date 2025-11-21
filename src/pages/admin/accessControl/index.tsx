import { useEffect, useState } from "react";
import { CardDepartment, Container, Header, Nav, Rules, Status, View } from "./style";
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
import { getPages } from "../../../services/apiManageONU/getPages";
import { handleIconMenu } from "../../../config/menu";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import { AddPage } from "./modals/addPage";
import { EditUser } from "./modals/editUser";
import { IPageCollection } from "../../../interfaces/IPages";
import { IUsers } from "../../../interfaces/IUsers";

export function AccessControl(){
    const [departments, setDepartments] = useState<IDepartments[]>([]);
    const [department, setDepartment] = useState<IDepartments | null>(null);
    const [accordions, setAccordions] = useState<number[]>([]);
    const [usersByDepartment, setUsersBydeparment] = useState<IUsers[]>([]);
    const [filteredTable, setFilteredTable] = useState<IUsers[]>([]);
    const [userSelected, setUserSelected] = useState<IUsers | null>(null);
    const [pages, setPages] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    //MODALS
    const [openAddPage, setOpenAddPage] = useState(false);
    const [openEditUser, setOpenEditUser] = useState(false);

    const handleOpenAddPage = () => setOpenAddPage(true);
    const handleCloseAddPage = () => setOpenAddPage(false);
    const handleOpenEditUser = () => setOpenEditUser(true);
    const handleCloseEditUser = () => setOpenEditUser(false);

    useEffect(() => {
        async function getData(){
            const response = await getDepartments();
            if(response && response.success){
                setDepartments(response.responses.response);
            } else {

            }
        }
        getData();
    }, []);

    useEffect(() => {
        if(department){
            async function getData(){
                const getPagesByDepartment = getPages({departmentId: department?.id});
                const getUsersByDepartment = getUsers({departmentId: department?.id});
                const [pages, users] = await Promise.all([getPagesByDepartment, getUsersByDepartment]);

                if(pages && pages.success){
                    setPages(pages.responses.response);
                }

                if(users){
                    if(users.success){
                        setUsersBydeparment(users.responses.response);
                        setFilteredTable(users.responses.response);
                    } else {

                    }
                } else {

                }
            }
            getData();
        }
    }, [department]);

    const handleExpandAccordion = (index: number) => {
        if(accordions.includes(index)){
            setAccordions(accordions.filter(accordions => accordions !== index));
        } else {
            setAccordions([...accordions, index]);
        }
    };

    const handleSelectDepartment = (id: number) => {
        const selectedDepartment = departments.find((department) => department.id === id);
        selectedDepartment ? setDepartment(selectedDepartment) : setDepartment(null);
    }

    const handleSearchValueChange = (value: string) => {
        let filteredUsers: IUsers[];
        if(value.includes('@')){
            filteredUsers = usersByDepartment.filter((el) => {
                if(el.email.toLowerCase().includes(value.toLowerCase())){
                    setPage(0);
                    return el;
                }
            });
        } else {
            filteredUsers = usersByDepartment.filter((el) => {
                if(el.name.toLowerCase().startsWith(value.toLowerCase())){
                    setPage(0);
                    return el;
                }
            });
        }
        setFilteredTable(filteredUsers);
    }
    
    const handleEditUser = (user: IUsers) => {
        setUserSelected(user);
        handleOpenEditUser();
    }

    const handleChangePage = (newPage: number) => { setPage(newPage); };
    const handleChangeRowsPerPage = (_event: any, newValue: number | null) => {
        setRowsPerPage(parseInt(newValue!.toString(), 10));
        setPage(0);
    };

    const getLabelDisplayedRowsTo = () => {
        if (usersByDepartment.length === -1) {
            return (page + 1) * rowsPerPage;
        }
        return rowsPerPage === -1
        ? usersByDepartment.length
        : Math.min(usersByDepartment.length, (page + 1) * rowsPerPage);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usersByDepartment.length) : 0;

    return(
        <Container>
            <Header className="header">
                TOTAL DE USUARIOS / LOGS GERAIS DE MUDANÇAS FEITAS AQ
            </Header>
            <Nav className="nav">
                <header className="flex">
                    <p>Departamentos e Cargos</p>
                </header>
                <div className="flex">
                    {departments && departments.map((department: IDepartments, index) => (
                        <CardDepartment className="flex" isSelected={index + 1 === department.id} isExpanded={accordions.includes(index)}>
                            <div className="header flex">
                                <div className="flex">
                                    <div>
                                        <p>{department.name}</p>
                                    </div>
                                    <div>
                                        <p>{department.Roles.length} cargos</p>
                                    </div>
                                </div>
                                <div>
                                    <IconButton variant="soft" size="sm" onClick={() => handleExpandAccordion(index)}>
                                        {accordions.includes(index) ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                    <IconButton variant="soft" size="sm" onClick={() => handleSelectDepartment(department.id)}>
                                        <KeyboardDoubleArrowRightIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="accordion">
                                {department.Roles.map((role, i) => (
                                    <div key={i} className="node">
                                        <div className="line-vertical" />
                                        <div className="box">{role.name}</div>
                                        {i < department.Roles.length - 1 && <div className="line-down" />}
                                    </div>
                                ))}
                            </div>
                        </CardDepartment>
                    ))}
                </div>
            </Nav>
            {
                department ? 
                    <View className="view">
                        <div className="config">
                            <h3>Departamento {department.name}</h3>
                            <div>
                                <FormControl>
                                    <FormLabel>Nome do departamento</FormLabel>
                                    <Input placeholder={department.name} />
                                </FormControl>
                            </div>
                            <div>
                                <FormControl sx={{ width: 240 }}>
                                    <FormLabel>
                                        Status
                                    </FormLabel>
                                    <Select value={department.status}>
                                        <Option value={true}>Ativo</Option>
                                        <Option value={false}>Inativo</Option>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="pages">
                            <div className="flex">
                                <h3>Páginas disponíveis</h3>
                                <IconButton variant="soft" color="success" onClick={handleOpenAddPage}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                            <div className="flex">
                                {pages && pages.map((collection: IPageCollection) => (
                                    collection.pages.map((page: IPageCollection["pages"][number], index: number) => (
                                        <div className="flex" key={index}>
                                            <div className="flex">
                                                <div className="flex">
                                                    {handleIconMenu(page.path)}<h4>{page.name}</h4>
                                                </div>
                                                <div className="flex">
                                                    {page.Rules.map((rule: IPageCollection["pages"][number]["Rules"][number], index: number) => (
                                                        <Rules action={rule.name} key={index}>{rule.name}</Rules>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <IconButton variant="soft" color="primary">
                                                    <EditOutlinedIcon />
                                                </IconButton>
                                                <IconButton variant="soft" color="danger">
                                                    <DeleteOutlineOutlinedIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    ))
                                ))}
                            </div>
                        </div>
                        <div className="table">
                            <div><h3>Usuários vinculados</h3></div>
                            <div>
                                <Sheet
                                    variant="outlined"
                                    sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm' }}
                                >
                                    <EnhancedTableToolbar
                                        onInputValueChange={handleSearchValueChange}
                                    />
                                    <Table
                                        stickyFooter
                                        hoverRow
                                        sx={{
                                            '--TableCell-headBackground': 'transparent',
                                            '--TableCell-selectedBackground': (theme) =>
                                                theme.vars.palette.success.softBg,
                                            '& thead th:nth-child(3)': {
                                                width: '76px',
                                            },
                                            '& thead th:nth-child(4)': {
                                                width: '144px',
                                            },
                                            '& tr > *:nth-child(n+3)': { textAlign: 'center' },
                                        }}
                                    >
                                        <EnhancedTableHead

                                        />
                                        <tbody>
                                        {[...filteredTable]
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                            return(
                                                <tr tabIndex={-1} key={index}>
                                                    <td>{row.name}</td>
                                                    <td>{row.email}</td>
                                                    <td>
                                                        {row.is_disabled ? 
                                                            <Status color="#F44336">Inativo</Status> : 
                                                            <Status color="#28A745">Ativo</Status>
                                                        }
                                                    </td>
                                                    <td>
                                                        <IconButton variant="soft" color="primary" size="sm" onClick={() => {handleEditUser(row)}}>
                                                            <EditOutlinedIcon />
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {emptyRows > 0 && (
                                            <tr
                                                style={{
                                                    height: `calc(${emptyRows} * 40px)`,
                                                    '--TableRow-hoverBackground': 'transparent',
                                                    } as React.CSSProperties
                                                }
                                            >
                                                <td colSpan={4} aria-hidden />
                                            </tr>
                                        )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={4}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                            justifyContent: 'flex-end',
                                                        }}
                                                    >
                                                        <FormControl orientation="horizontal" size="sm">
                                                            <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                                                                <Option value={5}>5</Option>
                                                                <Option value={10}>10</Option>
                                                            </Select>
                                                        </FormControl>
                                                        <Typography sx={{ textAlign: 'center', minWidth: 80 }}>
                                                            {labelDisplayedRows({
                                                                from: usersByDepartment.length === 0 ? 0 : page * rowsPerPage + 1,
                                                                to: getLabelDisplayedRowsTo(),
                                                                count: usersByDepartment.length === -1 ? -1 : usersByDepartment.length,
                                                            })}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <IconButton
                                                                size="sm"
                                                                color="neutral"
                                                                variant="outlined"
                                                                disabled={page === 0}
                                                                onClick={() => handleChangePage(page - 1)}
                                                                sx={{ bgcolor: 'background.surface' }}
                                                            >
                                                                <KeyboardArrowLeftIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                size="sm"
                                                                color="neutral"
                                                                variant="outlined"
                                                                disabled={
                                                                    usersByDepartment.length !== -1
                                                                        ? page >= Math.ceil(usersByDepartment.length / rowsPerPage) - 1
                                                                        : false
                                                                    }
                                                                onClick={() => handleChangePage(page + 1)}
                                                                sx={{ bgcolor: 'background.surface' }}
                                                            >
                                                                <KeyboardArrowRightIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </Sheet>
                            </div>
                        </div>
                    </View>
                :
                <div>teste</div>
            }
            {
                openAddPage && (
                    <AddPage 
                        open={openAddPage}
                        handleClose={handleCloseAddPage}
                    />
                )
            }
            {
                openEditUser && (
                    <EditUser 
                        open={openEditUser}
                        user={userSelected!}
                        departments={departments!}
                        handleClose={handleCloseEditUser}
                    />
                )
            }
        </Container>
    )
}