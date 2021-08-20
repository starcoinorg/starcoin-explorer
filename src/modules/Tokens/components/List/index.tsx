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
import TokenTable from '../Table';

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
  tokenList: any,
  isLoadingMore: boolean,
  getTokenList: (contents: any, callback?: any) => any,
  classes: any,
  t: any,
  match: any,
}

interface Props extends ExternalProps, InternalProps { }

interface IndexState {
  currentPage: number
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    tokenList: null,
    isLoadingMore: undefined,
    getTokenList: () => { }
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: parseInt(props.match.params.page, 10) || 1,
    };
  }

  componentDidMount() {
    this.fetchListPage(this.state.currentPage);
  }

  fetchListPage = (page: number) => {
    this.props.getTokenList({ page });
  };

  pagination = (type: string) => {
    const total = this.props.tokenList && this.props.tokenList.total.value || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.getTokenList({ page, total }, () => { this.pagenationCallback(page); });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.getTokenList({ page, total }, () => { this.pagenationCallback(page); });
    }
  };

  pagenationCallback = (page: number) => {
    this.setState({ currentPage: page });
    window.history.replaceState(null, '', `/${getNetwork()}/tokens/${page}`);
  };

  render() {
    const { tokenList, classes, t, className, isLoadingMore } = this.props;
    const isInitialLoad = !tokenList;
    const hits = tokenList && tokenList.contents || [];
    const tokens = hits.sort((a: any, b: any) => b.addressHolder - a.addressHolder);
    const tokenListTable = tokens.length ? (
      <TokenTable
        tokens={tokens}
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
          title={t('header.tokens')}
          name={t('header.tokens')}
          pluralName={t('header.tokens')}
          content={
            <div>
              {isInitialLoad ? <Loading /> : tokenListTable}
              <div className={classes.pagerArea}>
                <Pagination
                  page={this.state.currentPage}
                  pageSize={20}
                  currentPageSize={tokens == null ? null : tokens.length}
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
