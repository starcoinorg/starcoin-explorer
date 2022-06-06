import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { formatBalance, formatTokenName } from '@/utils/helper';
import { useTheme } from '@mui/styles';
import { useMemo, useState } from 'react';
import {  getBalancesData } from '@/utils/sdk';
import Loading from '@/common/Loading';



type Props = {
  address: any
}

function createData(
  name: string,
  balance: string,
) {
  return { name, balance };
}

export default function TokenTable(props: Props) {
  const theme = useTheme() as any
  const [balancesData,setBalancesData] = useState<any>([])
  const [loading, setLoading] = useState(true);
  useMemo(async () => {
    const fetch = async () => {
      const res = await getBalancesData(props.address);
      if (res){
        const rows: any = [];
        Object.keys(res).forEach((key) => {
          rows.push(createData(formatTokenName(key), formatBalance(res[key])));
        });
        setBalancesData(rows)
      }
      setLoading(false);
    };
    await fetch();
  }, [props.address]);
  const styles = {
    padding:theme.spacing(1),
    color: theme.palette.getContrastText(theme.palette.background.paper),
    borderBottom:  theme.palette.mode === 'dark' ?  '1px solid rgba(256, 256, 256, 0.075)' :  '1px solid rgba(0, 0, 0, 0.075)'
  }


  return <>{loading ? <Loading /> :
    <TableContainer  >
      <Table sx={{ minWidth: 400 }} aria-label='simple table'>
        <TableHead>
          <TableRow >
            <TableCell sx={styles}  align='left'>Token</TableCell>
            <TableCell  sx={styles} align='left'>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {balancesData.map((row: any,index:any) => (
            <TableRow
              key={`${row.name}${index}`}
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
    </TableContainer> }</>
  ;
}
