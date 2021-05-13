import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Loading from '@/common/Loading';
import ListView from '@/common/View/ListView';
import Pagination from '@/common/View/Pagination';
import Typography from '@material-ui/core/Typography';
import CenteredView from '@/common/View/CenteredView';
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
  t: any,
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
      currentPage: 1,
    };
  }

  componentDidMount() {
    this.fetchListPage(this.state.currentPage);
  }

  componentWillUnmount() {
    // stop tx polling
    this.fetchListPage(0);
  }

  fetchListPage = (page: number) => {
    this.props.getTransactionList({ page });
  };

  pagination = (type: string) => {
    // transactions use timestamp as sort filed, so we can not jump to specific page
    const hits = this.props.transactionList ? this.props.transactionList.hits : [];
    const last = hits[hits.length - 1];
    const after = last && last.sort[0] || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.getTransactionList({ page, after }, () => { this.pagenationCallback(page); });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.getTransactionList({ page, after }, () => { this.pagenationCallback(page); });
    }
  };

  pagenationCallback = (page: number) => {
    this.setState({ currentPage: page });
  };

  render() {
    const { transactionList, isLoadingMore, className, classes, t } = this.props;
    const isInitialLoad = !transactionList;
    const transactions = transactionList && transactionList.hits || [];
    const transactionsList = transactions.length ? (
      <TransactionTable
        transactions={transactions}
      />
    ) : (
      <CenteredView>
        <div className={classes.header}>
          <Typography variant="h5" gutterBottom className={classes.title}>
            {t('transaction.NoTransactionData')}
          </Typography>
        </div>
      </CenteredView>
    );
    return (
      <div>
        <Helmet>
          <title>{t('header.transactions')}</title>
        </Helmet>
        <ListView
          className={className}
          title={t('header.transactions')}
          name={t('header.transactions')}
          pluralName={t('header.transactions')}
          content={
            <div>
              {isInitialLoad ? <Loading /> : transactionsList}
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

export default withStyles(useStyles)(withTranslation()(Index));
