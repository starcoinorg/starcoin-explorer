import React from 'react';
import TransferTransactionSummary from '../TransactionSummary/TransferTransactionSummary';

interface ExternalProps {
  transactions: any,
  address: any,
  className?: string,
}

interface InternalProps {}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { transactions, address, className } = this.props;
    return (
      <div className={className}>
        {transactions.map((transaction: any) => (
          <TransferTransactionSummary
            key={transaction._id || transaction.transaction_hash}
            transaction={transaction}
            address={address}
          />
        ))}
      </div>
    );
  }
}

export default Index;
