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
import { getTokenPrecision } from '@/utils/sdk';
import TokenTransactionTable from '../TransactionTable';

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
  tokenTransactionList: any,
  isLoadingMore: boolean,
  getTokenTransactionList: (contents: any, callback?: any) => any,
  classes: any,
  t: any,
  match: any,
}

interface Props extends ExternalProps, InternalProps {
}

interface IndexState {
  tokenTypeTag: string,
  tokenPrecision: number,
  currentPage: number
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    tokenTransactionList: null,
    isLoadingMore: undefined,
    getTokenTransactionList: () => {
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: parseInt(props.match.params.page, 10) || 1,
      tokenPrecision: 1,
      tokenTypeTag: props.match.params.token_type_tag || '',
    };
  }

  componentDidMount() {
    this.fetchTokenPrecision(this.state.tokenTypeTag);
    this.fetchListPage(this.state.tokenTypeTag, this.state.currentPage);
  }

  fetchListPage = (token_type_tag: string, page: number) => {
    this.props.getTokenTransactionList({ token_type_tag, page });
  };

  fetchTokenPrecision = (token_type_tag: string) => {
    if (token_type_tag) {
      getTokenPrecision(token_type_tag).then(data => {
        if (data) {
          this.setState({ tokenPrecision: parseInt(data[0], 10) });
        } else {
          console.log('get precision failed');
        }
      });
    }
  };

  pagination = (type: string) => {
    const total = this.props.tokenTransactionList && this.props.tokenTransactionList.total || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      const token_type_tag = this.state.tokenTypeTag;
      this.fetchTokenPrecision(token_type_tag);
      this.props.getTokenTransactionList({ token_type_tag, page, total }, () => {
        this.pagenationCallback(page);
      });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      const token_type_tag = this.state.tokenTypeTag;
      this.fetchTokenPrecision(token_type_tag);
      this.props.getTokenTransactionList({ token_type_tag, page, total }, () => {
        this.pagenationCallback(page);
      });
    }
  };

  pagenationCallback = (page: number) => {
    this.setState({ currentPage: page });
    window.history.replaceState(null, '', `/${getNetwork()}/tokens/holders/${this.state.tokenTypeTag}/${page}`);
  };

  render() {
    const { tokenTransactionList, classes, t, className, isLoadingMore } = this.props;
    const precision = this.state.tokenPrecision ? this.state.tokenPrecision : 1;
    const isInitialLoad = !tokenTransactionList;
    const hits = tokenTransactionList && tokenTransactionList.contents || [];
    const transactions = hits.sort((a: any, b: any) => b.timestamp - a.timestamp);
    const tokenTransactionListTable = transactions.length ? (
      <TokenTransactionTable
        tokenTransactions={tokenTransactionList}
        sizeVisibleAt='xs'
        authorVisibleAt='md'
        tokenPrecision={precision}
      />
    ) : (
      <CenteredView>
        <div className={classes.header}>
          <Typography variant='h5' gutterBottom className={classes.title}>
            {t('token.NoTokenData')}
          </Typography>
        </div>
      </CenteredView>
    );
    return (
      <div>
        <Helmet>
          <title>{t('header.tokens')}</title>
        </Helmet>
        <ListView
          className={className}
          title={t('token.transactionList')}
          name={t('token.transactionList')}
          pluralName={t('token.transactionList')}
          content={
            <div>
              {isInitialLoad ? <Loading /> : tokenTransactionListTable}
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
