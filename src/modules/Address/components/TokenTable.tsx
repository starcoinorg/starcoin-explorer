import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {formatTokenName, getNetwork } from '@/utils/helper';
import { useTheme } from '@mui/styles';
import { useMemo, useState } from 'react';
import { getBalancesData } from '@/utils/sdk';
import BigNumber from 'bignumber.js';
import Loading from '@/common/Loading';
import CommonLink from '@/common/Link';



type Props = {
  address: any
}

function createData(
  name: string,
  balance: BigNumber,
  full_name: string,
) {
  return { name, balance,full_name };
}

export default function TokenTable(props: Props) {
  const theme = useTheme() as any
  const [balancesData,setBalancesData] = useState<any>([])
  const [loading, setLoading] = useState(true);
  useMemo(async () => {
    const fetch = async () => {
      const res = await getBalancesData(props.address);
      if (res){
        const rows =  res.map((item:any)=>{
          const value = new BigNumber(item.amount);
          return createData(formatTokenName(item.name), value.div(item.scaling_factor), item.name)
        })

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
            <TableCell  sx={styles} align='left'>Token Full Name </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {balancesData.map((row: any,index:any) => (
            <TableRow
              key={`${row.name}${index}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={styles} align='left' width={theme.spacing(10)} component='th' scope='row'>
                {row.name}
              </TableCell>

              <TableCell sx={styles} align='left' width={theme.spacing(12)} >{row.balance.toString()}</TableCell>
              <TableCell sx={styles} align='left' ><CommonLink path={`/${getNetwork()}/tokens/detail/${row.full_name}`} title={row.full_name}/> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer> }</>
  ;
}
