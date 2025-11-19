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

type Order = 'asc' | 'desc';

interface EnhancedTableToolbarProps {
}

export function labelDisplayedRows({ from, to, count,} : {
  from: number;
  to: number;
  count: number;
}) {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

interface HeadCell {
    disablePadding: boolean;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        numeric: false,
        disablePadding: true,
        label: 'Nome',
    },
    {
        numeric: false,
        disablePadding: false,
        label: 'Email',
    },
    {
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    {
        numeric: false,
        disablePadding: false,
        label: '',
    },
];

interface EnhancedTableProps {

}

export function EnhancedTableHead(props: EnhancedTableProps) {
    const { } = props;

    return (
        <thead>
            <tr>
                {headCells.map((headCell) => {
                    return (
                        <th key={headCell.label}>
                            <Link
                                underline="none"
                                color="neutral"
                                component="button"
                            >
                                {headCell.label}
                            </Link>
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    return (
        <Box
            sx={[
                {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:'flex-end',
                    py: 1,
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    borderTopLeftRadius: 'var(--unstable_actionRadius)',
                    borderTopRightRadius: 'var(--unstable_actionRadius)',
                },
            ]}
        >
            <Tooltip title="Filter list">
                <SearchInput placeholder='Busque aqui' />
            </Tooltip>
        </Box>
    );
}