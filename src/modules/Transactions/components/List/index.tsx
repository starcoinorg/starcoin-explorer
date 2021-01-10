import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Loading from '@/common/Loading';
import ListView from '@/common/View/ListView';
import Pagination from '@/common/View/Pagination';
import TransactionTable from '../Table';

const useStyles = () => createStyles({
  pagerArea: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

interface ExternalProps {
  className?: string,
}

interface InternalProps {
  transactionList: any,
  isLoadingMore: boolean,
  getTransactionList: (data: any, callback?: any) => any,
  classes: any,
}

interface Props extends ExternalProps, InternalProps {}

interface IndexState {
  currentPage: number
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    transactionList: null,
    isLoadingMore: undefined,
    getTransactionList: () => {}
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }

  componentDidMount() {
    this.fetchListPage(this.state.currentPage);
  }

  fetchListPage = (page: number) => {
    this.props.getTransactionList({ page });
  };

  pagination = (type: string) => {
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.getTransactionList({ page }, () => { this.setState({ currentPage: page }); });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.getTransactionList({ page }, () => { this.setState({ currentPage: page }); });
    }
  };

  render() {
    const { transactionList, isLoadingMore, className, classes } = this.props;
    const isInitialLoad = !transactionList;
    const transactions = transactionList && transactionList.hits.hits || [];
    return (
      <div>
        <Helmet>
          <title>Transactions</title>
        </Helmet>
        <ListView
          className={className}
          name="Transactions"
          pluralName="Transactions"
          content={
            <div>
              {isInitialLoad ? <Loading /> : <TransactionTable
                transactions={transactions}
              />}
              <div className={classes.pagerArea}>
                <Pagination
                  page={this.state.currentPage}
                  pageSize={20}
                  currentPageSize={transactions == null ? null : transactions.length}
                  hasPreviousPage={this.state.currentPage > 1}
                  hasNextPage={!!true}
                  onPrevPage={() => this.pagination('prev')}
                  onNextPage={() => this.pagination('next')}
                  isLoading={isLoadingMore}
                />
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
