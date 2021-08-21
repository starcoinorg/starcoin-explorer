import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Loading from '@/common/Loading';
import ListView from '@/common/View/ListView';
import Pagination from '@/common/View/Pagination';
import Typography from '@material-ui/core/Typography';
import CenteredView from '@/common/View/CenteredView';
import { getNetwork } from '@/utils/helper';
import TokenTransactionTable from '../TransactionTable';

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
  tokenTransactionList: any,
  isLoadingMore: boolean,
  getTokenTransactionList: (contents: any, callback?: any) => any,
  classes: any,
  t: any,
  match: any,
}

interface Props extends ExternalProps, InternalProps { }

interface IndexState {
  tokenTypeTag: string,
  currentPage: number
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    tokenTransactionList: null,
    isLoadingMore: undefined,
    getTokenTransactionList: () => { }
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: parseInt(props.match.params.page, 10) || 1,
      tokenTypeTag: props.match.params.token_type_tag || '',
    };
  }

  componentDidMount() {
    this.fetchListPage(this.state.tokenTypeTag, this.state.currentPage);
  }

  fetchListPage = (token_type_tag: string, page: number) => {
    this.props.getTokenTransactionList({ token_type_tag, page });
  };

  pagination = (type: string) => {
    const total = this.props.tokenTransactionList && this.props.tokenTransactionList.total || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      const token_type_tag = this.state.tokenTypeTag;
      this.props.getTokenTransactionList({ token_type_tag, page, total }, () => { this.pagenationCallback(page); });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      const token_type_tag = this.state.tokenTypeTag;
      this.props.getTokenTransactionList({ token_type_tag, page, total }, () => { this.pagenationCallback(page); });
    }
  };

  pagenationCallback = (page: number) => {
    this.setState({ currentPage: page });
    window.history.replaceState(null, '', `/${getNetwork()}/tokens/holders/${this.state.tokenTypeTag}/${page}`);
  };

  render() {
    const { tokenTransactionList, classes, t, className, isLoadingMore } = this.props;
    console.log({ tokenTransactionList });
    const isInitialLoad = !tokenTransactionList;
    const hits = tokenTransactionList && tokenTransactionList.contents || [];
    const transactions = hits.sort((a: any, b: any) => b.timestamp - a.timestamp);
    const tokenTransactionListTable = transactions.length ? (
      <TokenTransactionTable
        tokenTransactions={tokenTransactionList}
        sizeVisibleAt="xs"
        authorVisibleAt="md"
      />
    ) : (
      <CenteredView>
        <div className={classes.header}>
          <Typography variant="h5" gutterBottom className={classes.title}>
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
