import React, { PureComponent } from 'react';
import classNames from 'classnames';
import CommonTime from '@/common/Time';
import CommonLink from '@/common/Link';
import { getNetwork } from '@/utils/helper';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { encoding } from '@starcoin/starcoin';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('sm')]: {
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      paddingLeft: theme.spacing(1) * 2,
      paddingRight: theme.spacing(1) * 2,
    },
  },
  root: {
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
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
  transaction: any,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {}

class Index extends PureComponent<Props> {
  render() {
    const { transaction, className, classes } = this.props;
    const isTransaction = !!transaction;
    const source = isTransaction ? transaction : transaction;
    let payloadInHex = '';
    if (source.raw_txn) {
      payloadInHex = source.raw_txn.payload;
    }
    const txnPayload = payloadInHex ? encoding.decodeTransactionPayload(payloadInHex) : [];
    const type = Object.keys(txnPayload)[0];
    return (
      <div className={classNames(classes.root, className)}>
        {type}&nbsp;
        <CommonLink path={`/${getNetwork()}/pending_transactions/detail/${source.transaction_hash}`} title={source.transaction_hash} />
        <div className={classes.rightHeader}>
          <CommonTime
            className={classes.time}
            time={isTransaction ? source.timestamp : source.raw_txn.expiration_timestamp_secs * 1000}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
