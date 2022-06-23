import * as React from 'react';
import { formatBalance, getNetwork } from '@/utils/helper';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

type Props = {
  address: string,
  from: string,
  to: string,
  amount: string,
  name: string,
}
export default function TransactionP2PItem(props: Props) {
  const navigate = useNavigate();
  const theme = useTheme() as any
  return <div style={{ paddingLeft: theme.spacing(3) }}>from: {props.from === props.address ? ' this address' : <a style={{cursor: 'pointer'}} href="#" onClick={() => {
    navigate(`/${getNetwork()}/address/${props.from}`);
  }
  }>{props.from}</a>} to:{props.to === props.address ? ' this address' : <a
  style={{cursor: 'pointer'}} href="#"
    onClick={() => {
      navigate(`/${getNetwork()}/address/${props.to}`);
    }}
  >{props.to}</a>} {formatBalance(props.amount)} {props.name}</div>;
}
