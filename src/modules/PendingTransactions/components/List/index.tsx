import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@mui/styles';
import Loading from '@/common/Loading';
import ListView from '@/common/View/ListView';
import Pagination from '@/common/View/Pagination';
import Typography from '@mui/material/Typography';
import CenteredView from '@/common/View/CenteredView';
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
  pendingTransactionList: any,
  isLoadingMore: boolean,
  getPendingTransactionList: (contents: any, callback?: any) => any,
  classes: any,
  t: any,
}

interface Props extends ExternalProps, InternalProps {
}

interface IndexState {
  currentPage: number;
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    pendingTransactionList: null,
    isLoadingMore: undefined,
    getPendingTransactionList: () => {
    },
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

  fetchListPage = (page: number) => {
    this.props.getPendingTransactionList({ page });
  };

  pagination = (type: string) => {
    // transactions use timestamp as sort filed, so we can not jump to specific page
    const hits = this.props.pendingTransactionList ? this.props.pendingTransactionList.contents : [];
    const last = hits[hits.length - 1];
    const after = last && last.sort || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.getPendingTransactionList({ page, after }, () => {
        this.pagenationCallback(page);
      });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.getPendingTransactionList({ page, after }, () => {
        this.pagenationCallback(page);
      });
    }
  };

  pagenationCallback = (page: number) => {
    this.setState({ currentPage: page });
  };

  render() {
    const { pendingTransactionList, isLoadingMore, className, classes, t } = this.props;
    const isInitialLoad = !pendingTransactionList;
    const pendingTransactions = pendingTransactionList && pendingTransactionList.contents || [];
    const pendingTransactionsList = pendingTransactions.length ? (
      <TransactionTable
        transactions={pendingTransactions}
      />
    ) : (
      <CenteredView>
        <div className={classes.header}>
          <Typography variant='h5' gutterBottom className={classes.title}>
            {t('pending_transaction.NoPendingTransactionData')}
          </Typography>
        </div>
      </CenteredView>
    );
    return (
      <div>
        <Helmet>
          <title>{t('header.pendingTransactions')}</title>
        </Helmet>
        <ListView
          className={className}
          title={t('header.pendingTransactions')}
          name={t('header.pendingTransactions')}
          pluralName={t('header.pendingTransactions')}
          content={
            <div>
              {isInitialLoad ? <Loading /> : pendingTransactionsList}
              <div className={classes.pagerArea}>
                <Pagination
                  page={this.state.currentPage}
                  pageSize={20}
                  currentPageSize={pendingTransactions == null ? null : pendingTransactions.length}
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
