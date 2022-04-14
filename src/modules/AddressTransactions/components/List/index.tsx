import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@mui/styles';
import Loading from '@/common/Loading';
import ListView from '@/common/View/ListView';
import Pagination from '@/common/View/Pagination';
import Typography from '@mui/material/Typography';
import CenteredView from '@/common/View/CenteredView';
import { getNetwork } from '@/utils/helper';
import TransactionTable from '../Table';

const useStyles = (theme: any) => createStyles({
  pagerArea: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
});

interface ExternalProps {
  className?: string,
}

interface InternalProps {
  match: any;
  addressTransactionList: any,
  isLoadingMore: boolean,
  getAddressTransactionList: (contents: any, callback?: any) => any,
  classes: any,
  t: any,
}

interface Props extends ExternalProps, InternalProps {
}

interface IndexState {
  currentPage: number,
  address: string,
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    addressTransactionList: null,
    isLoadingMore: undefined,
    getAddressTransactionList: () => {
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1,
      address: '',
    };
  }

  componentDidMount() {
    this.setState({ address: this.props.match.params.hash });
    this.fetchListPage(this.props.match.params.hash, this.state.currentPage);
  }

  fetchListPage = (hash: string, page: number) => {
    this.props.getAddressTransactionList({ hash, page });
  };

  pagination = (type: string) => {
    // transactions use timestamp as sort filed, so we can not jump to specific page
    const hits = this.props.addressTransactionList ? this.props.addressTransactionList.contents : [];
    const last = hits[hits.length - 1];
    const hash = this.props.match.params.hash;
    const after = last && last.sort || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.getAddressTransactionList({ hash, page, after }, () => {
        this.pagenationCallback(page);
      });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.getAddressTransactionList({ hash, page, after }, () => {
        this.pagenationCallback(page);
      });
    }
  };

  pagenationCallback = (page: number) => {
    this.setState({ currentPage: page });
    window.history.replaceState(null, '', `/${getNetwork()}/address_transactions/${this.state.address}/${page}`);
  };

  render() {
    const { addressTransactionList, isLoadingMore, className, classes, t } = this.props;
    const isInitialLoad = !addressTransactionList;
    const transactions = addressTransactionList && addressTransactionList.contents || [];
    const transactionsList = transactions.length ? (
      <TransactionTable
        transactions={transactions}
        address={this.state.address}
      />
    ) : (
      <CenteredView>
        <div className={classes.header}>
          <Typography variant='h5' gutterBottom className={classes.title}>
            {t('transaction.NoTransactionData')}
          </Typography>
        </div>
      </CenteredView>
    );
    return (
      <div>
        <Helmet>
          <title>{t('header.addressTransactions')}</title>
        </Helmet>
        <ListView
          id={this.state.address}
          className={className}
          title={t('header.addressTransactions')}
          name={t('header.addressTransactions')}
          pluralName={t('header.addressTransactions')}
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
