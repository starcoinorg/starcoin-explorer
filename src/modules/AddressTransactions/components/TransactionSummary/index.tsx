import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { getNetwork } from '@/utils/helper';
import { withStyles, createStyles } from '@mui/styles';
import { onchain_events, encoding, bcs } from '@starcoin/starcoin';
import { isObject } from 'lodash';
import { arrayify } from '@ethersproject/bytes';
import CommonLink from '@/common/Link';
import CommonTime from '@/common/Time';
import TransactionP2PItem from '@/Transactions/components/TransactionSummary/TransactionP2PItem';

const useStyles = (theme: any) =>
  createStyles({
    [theme.breakpoints.down('md')]: {
      root: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
      },
    },
    [theme.breakpoints.up('sm')]: {
      root: {
        paddingLeft: theme.spacing(2) ,
        paddingRight: theme.spacing(2) ,
      },
    },
    root: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: theme.spacing(1),
    },
    borderBottom: {
      borderBottom: theme.palette.mode === 'dark' ?  '1px solid rgba(256, 256, 256, 0.075)' : '1px solid rgba(0, 0, 0, 0.075)',
      paddingBottom: theme.spacing(1),
    },
    leftHeader: {
      flex: '1 100 auto',
      marginRight: theme.spacing(1),
      minWidth: 150,
    },
    rightHeader: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 208px',
      justifyContent: 'flex-end',
      minWidth: '0',
    },
    time: {
      marginRight: theme.spacing(1),
    },
  });

interface ExternalProps {
  transaction: any;
  address: any;
  className?: string;
}

interface InternalProps {
  classes: any;
}

interface Props extends ExternalProps, InternalProps {
}

class TransactionSummary extends PureComponent<Props> {
  render() {
    const { transaction, address, className, classes } = this.props;
    const isTransaction = !!transaction;
    const source = isTransaction ? transaction : transaction;
    let payloadInHex = '';
    let isP2P = false;
    let p2pObj = {
      address:"",
      from:"",
      to:"",
      amount:"",
      name:"",
    };
    if (source.user_transaction) {
      payloadInHex = source.user_transaction.raw_txn.payload;
    }
    if (source.raw_txn) {
      payloadInHex = source.raw_txn.payload;
    }
    const txnPayload = payloadInHex
      ? encoding.decodeTransactionPayload(payloadInHex)
      : [];
    const type = Object.keys(txnPayload)[0];

    // @ts-ignore
    if (isObject(txnPayload) && txnPayload.ScriptFunction && txnPayload.ScriptFunction.func && txnPayload.ScriptFunction.func.address === '0x00000000000000000000000000000001' && txnPayload.ScriptFunction.func.functionName === 'peer_to_peer_v2' && txnPayload.ScriptFunction.func.module === 'TransferScripts') {
      isP2P = true;
      console.info('txn', txnPayload,transaction);
      // @ts-ignore
      const amount = new bcs.BcsDeserializer(arrayify(txnPayload.ScriptFunction.args[1]))
      console.info()

      p2pObj = {
        address:address as string,
        from:transaction.user_transaction.raw_txn.sender,
        // @ts-ignore
        to:txnPayload.ScriptFunction.args[0],
        amount:amount.deserializeU128().toString(),
        // @ts-ignore
        name:txnPayload.ScriptFunction.ty_args[0].Struct.name,
      };

    }


    const events = transaction.events || [];
    let transferDirection = '';
    events.forEach((txnEvent: any) => {
      try {
        const eventKeyInHex = txnEvent.event_key;
        const de = onchain_events.decodeEventKey(eventKeyInHex);
        if (txnEvent.type_tag.includes('DepositEvent') && (de.address === address)) {
          transferDirection = 'IN';
        }
        if (txnEvent.type_tag.includes('WithdrawEvent') && (de.address === address)) {
          transferDirection = 'OUT';
        }
      } catch (e) {
        console.log('decode event key error');
      }
    });

    return (
      <div className={classes.borderBottom}>
      <div className={classNames(classes.root, className)}>
        {transferDirection}&nbsp;
        {isP2P ? "Transfer" : type}&nbsp;
        <CommonLink
          path={`/${getNetwork()}/transactions/detail/${
            source.transaction_hash
          }`}
          title={source.transaction_hash}
        />
        <div className={classes.rightHeader}>
          <CommonTime
            className={classes.time}
            time={
              isTransaction
                ? source.timestamp
                : source.raw_txn.expiration_timestamp_secs * 1000
            }
          />
        </div>


      </div>
        {isP2P ? <TransactionP2PItem {...p2pObj}/> :<></>}
      </div>
    );
  }
}

export default withStyles(useStyles)(TransactionSummary);
