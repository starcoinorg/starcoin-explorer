import React from 'react';
import TransactionSummary from '../TransactionSummary';

interface ExternalProps {
  transactions: any,
  className?: string,
}

interface InternalProps {}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { transactions, className } = this.props;
    return (
      <div className={className}>
        {transactions.map((transaction: any) => (
          <TransactionSummary
            key={transaction._id || transaction.transaction_hash}
            transaction={transaction}
          />
        ))}
      </div>
    );
  }
}

export default Index;
