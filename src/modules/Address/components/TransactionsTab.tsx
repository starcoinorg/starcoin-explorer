import React, { useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import Loading from '@/common/Loading';
import TransferTransactionTable from '@/Transactions/components/Table/TransferTransactionTable';
import { getAddressTransactions } from '@/Transactions/store/apis';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

type Props = {
  address: string
}

export default function TransactionsTab(props: Props) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any>([]);
  useMemo(async () => {
    const fetch = async () => {
      const res = await getAddressTransactions({hash:props.address} );
      if (res && res.contents){
        setTransactions(res.contents);
      }
      setLoading(false);
    };
    await fetch();
  }, [props.address]);
  return <Root>
    {loading ? <Loading /> : <TransferTransactionTable
      transactions={transactions}
      address={props.address}
    />}
  </Root>;
}