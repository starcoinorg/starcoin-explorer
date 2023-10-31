import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { createStyles, withStyles } from '@mui/styles';

import TransactionSummary from '../TransactionSummary';

const useStyles = () =>
  createStyles({
    item: {
      display: 'flex',
    },
  });

interface ExternalProps {
  transactions: any;
  handleSelectedRows?: (checked: boolean, transaction: any) => void;
  className?: string;
}

interface InternalProps {
  classes: any;
}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { transactions, handleSelectedRows, className, classes } = this.props;

    return (
      <div className={className}>
        {transactions.map((transaction: any) => (
          <div className={classes.item}>
            <Checkbox
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const checked = event.target.checked;

                if (handleSelectedRows)
                  handleSelectedRows(checked, transaction);
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <TransactionSummary
              key={transaction._id || transaction.transaction_hash}
              transaction={transaction}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
