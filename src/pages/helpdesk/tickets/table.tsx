import React from 'react';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Checkbox from '@mui/joy/Checkbox';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { visuallyHidden } from '@mui/utils';
import { SearchInput } from '../../../components/SeachInput';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { IAuthedUser } from '../../../interfaces/IUsers';

//import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

import { useResponse } from '../../../hooks/useResponse';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { updateTicket } from '../../../services/apiManageONU/updateTicket';
import { ITickets } from '../../../interfaces/ITickets';
import { FilterTicket } from './style';
import { List, ListItem, ListItemDecorator, Radio, RadioGroup } from '@mui/joy';

type Order = 'asc' | 'desc';
export interface Data {
  ticketId: number;
  createdBy: string;
  city: string;
  appropriatedBy: string;
  'Ticket_status.id': string;
  'Ticket_Types.id': number;
}

interface EnhancedTableToolbarProps {
    user: IAuthedUser;
    numSelected: number;
    ticketId: number | undefined;
    isOpened: boolean | undefined;
    originDepartmentId?: number;
    destinationDepartmentId?: number;
    onOpenViewTicket: () => void;
    onOpenEditTicket: () => void;
    //onOpenFinishTicket: () => void;
}

export function labelDisplayedRows({ from, to, count,} : {
  from: number;
  to: number;
  count: number;
}) {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function descendingComparator<T>(a: any, b: any, orderBy: keyof T, isNested: boolean) {
    if(isNested){
        const nested = orderBy.toString().split('.');
        console.log(a.Ticket_status.id)
        if (b[nested[0]][nested[1]] < a[nested[0]][nested[1]]) {
            return -1;
        }
        if (b[nested[0]][nested[1]] > a[nested[0]][nested[1]]) {
            return 1;
        }
        return 0;
    } else {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
}

export function getComparator<Key extends keyof Data>(
    order: Order,
    orderBy: Key,
    isNested: boolean
): (
    a: ITickets,
    b: ITickets,
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy, isNested)
        : (a, b) => -descendingComparator(a, b, orderBy, isNested);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
    sort: Boolean;
    nested: boolean,
}

const headCells: readonly HeadCell[] = [
    {
        id: 'ticketId',
        sort: false,
        nested: false,
        numeric: false,
        disablePadding: true,
        label: 'Identificador',
    },
    {
        id: 'createdBy',
        sort: false,
        nested: false,
        numeric: false,
        disablePadding: false,
        label: 'Aberto por',
    },
    {
        id: 'city',
        sort: false,
        nested: false,
        numeric: false,
        disablePadding: false,
        label: 'Cidade',
    },
    {
        id: 'Ticket_Types.id',
        sort: true,
        nested: true,
        numeric: false,
        disablePadding: false,
        label: 'Tipo de problema',
    },
    {
        id: 'appropriatedBy',
        sort: false,
        nested: false,
        numeric: false,
        disablePadding: false,
        label: 'Apropriado por',
    },
    {
        id: 'Ticket_status.id',
        sort: true,
        nested: true,
        numeric: true,
        disablePadding: false,
        label: 'Status',
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data, isNested: boolean) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

export function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof Data, isSortable: Boolean, isNested: boolean) => (event: React.MouseEvent<unknown>) => {
        isSortable ? onRequestSort(event, property, isNested): null;
    };

    return (
        <thead>
            <tr>
                <th>
                </th>
                {headCells.map((headCell) => {
                    const active = orderBy === headCell.id;
                    return (
                        <th
                            key={headCell.id}
                            aria-sort={
                                active
                                ? ({ asc: 'ascending', desc: 'descending' } as const)[order]
                                : undefined
                            }
                        >
                            <Link
                                underline="none"
                                color="neutral"
                                textColor={active ? 'primary.plainColor' : undefined}
                                component="button"
                                onClick={createSortHandler(headCell.id, headCell.sort, headCell.nested)}
                                startDecorator={
                                    headCell.numeric && headCell.sort ? (
                                        <ArrowDownwardIcon
                                            sx={[active ? { opacity: 1 } : { opacity: 0 }]}
                                        />
                                    ) : null
                                }
                                endDecorator={
                                    !headCell.numeric && headCell.sort ? (
                                        <ArrowDownwardIcon
                                            sx={[active ? { opacity: 1 } : { opacity: 0 }]}
                                        />
                                    ) : null
                                }
                                sx={{
                                    fontWeight: 'lg',
                                    '& svg': {
                                        transition: '0.2s',
                                        transform:
                                        active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                                    },
                                    '&:hover': { '& svg': { opacity: 1 } },
                                }}
                            >
                                {headCell.label}
                                {active ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </Link>
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { setFetchResponseMessage } = useResponse();
    const { numSelected, user, ticketId, originDepartmentId, destinationDepartmentId, isOpened } = props;

    const handleAppropriate = async () => {
        if(user.rule === destinationDepartmentId){
            const response = await updateTicket({ ticketId: ticketId!, appropriatedBy: user.uid, userId: user.uid});

            if(response && response.success){
                setFetchResponseMessage(response.responses.status);
            }
        }
    };

    return (
        <Box
            sx={[
                {
                    display: 'flex',
                    alignItems: 'center',
                    height: '56px',
                    py: 1,
                    pr: 1,
                    pb: 1,
                    borderTopLeftRadius: 'var(--unstable_actionRadius)',
                    borderTopRightRadius: 'var(--unstable_actionRadius)',
                },
                    numSelected > 0 && {
                    bgcolor: 'background.level1',
                },
            ]}
        >
            {numSelected > 0 ? (
                <FilterTicket>
                    {/*A PRIMEIRA DIV É SÓ PRA FAZER O ESPAÇAMENTO*/}
                    <div></div>
                    <div>
                        {
                            /*
                            user.rule === destinationDepartmentId && (
                                <Tooltip title="Encerrar ticket" sx={{mr: 1}}>
                                    <IconButton size="sm" variant="soft" >
                                        <CheckCircleOutlinedIcon color="success" />
                                    </IconButton>
                                </Tooltip>
                            )
                            */
                        }
                        {
                            isOpened && user.rule === destinationDepartmentId && (
                                <Tooltip title="Apropriar-se" sx={{mr: 1}}>
                                    <IconButton size="sm" color="primary" variant="soft" onClick={handleAppropriate}>
                                        <PushPinOutlinedIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                        {
                            isOpened && user.rule === originDepartmentId && (
                                <Tooltip title="Editar" sx={{mr: 1}}>
                                    <IconButton size="sm" color="primary" variant="soft" onClick={props.onOpenEditTicket}>
                                        <EditOutlinedIcon color="secondary" />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                        <Tooltip title="Vizualizar ticket">
                            <IconButton size="sm" color="primary" variant="soft" onClick={props.onOpenViewTicket}>
                                <VisibilityOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    
                </FilterTicket>
            ) : (
                <FilterTicket>
                    <div>
                        <RadioGroup name="people" defaultValue='0'>
                            <List
                                sx={{
                                    minWidth: 140,
                                    flexDirection: 'row',
                                    '--ListItem-radius': '8px',
                                    '--ListItemDecorator-size': '32px',
                                }}
                            >
                                {['Em aberto', 'Finalizados'].map((item, index) => (
                                <ListItem variant="outlined" key={item} sx={{ boxShadow: 'sm', ml: 1 }}>
                                    <Radio
                                        overlay
                                        value={index}
                                        label={item}
                                        sx={{ flexGrow: 1, flexDirection: 'row-reverse' }}
                                        slotProps={{
                                            action: ({ checked }) => ({
                                            sx: (theme) => ({
                                                ...(checked && {
                                                    inset: -1,
                                                    border: '2px solid',
                                                    borderColor: theme.vars.palette.primary[500],
                                                }),
                                            }),
                                            }),
                                        }}
                                    />
                                </ListItem>
                                ))}
                            </List>
                        </RadioGroup>
                    </div>
                    <div>
                        <Tooltip title="Filter list">
                            <SearchInput placeholder='Busque aqui'/>
                        </Tooltip>
                    </div>
                </FilterTicket>
            )}
        </Box>
    );
}