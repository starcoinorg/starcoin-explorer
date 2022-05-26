import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { formatBalance, formatTokenName } from '@/utils/helper';
import { useTheme } from '@mui/styles';


type Props = {
  data: any
}

function createData(
  name: string,
  balance: string,
) {
  return { name, balance };
}

export default function TokenTable(props: Props) {
  const theme = useTheme() as any
  const styles = {
    padding:theme.spacing(1),
    color: theme.palette.getContrastText(theme.palette.background.paper),
  }
  const rows: any = [];
  Object.keys(props.data).forEach((key) => {
      rows.push(createData(formatTokenName(key), formatBalance(props.data[key])));
  });

  return (
    <TableContainer  >
      <Table sx={{ minWidth: 400 }} aria-label='simple table'>
        <TableHead>
          <TableRow >
            <TableCell sx={styles}  align='left'>Token</TableCell>
            <TableCell  sx={styles} align='left'>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={styles} align='left' width={theme.spacing(20)} component='th' scope='row'>
                {row.name}
              </TableCell>

              <TableCell sx={styles} align='left' >{row.balance}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
