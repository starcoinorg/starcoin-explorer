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
import HolderTable from '../HolderTable';

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
  tokenHolderList: any,
  isLoadingMore: boolean,
  getTokenHolderList: (contents: any, callback?: any) => any,
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
    tokenHolderList: null,
    isLoadingMore: undefined,
    getTokenHolderList: () => { }
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
    this.props.getTokenHolderList({ token_type_tag, page });
  };

  pagination = (type: string) => {
    const total = this.props.tokenHolderList && this.props.tokenHolderList.total || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      const token_type_tag = this.state.tokenTypeTag;
      this.props.getTokenHolderList({ token_type_tag, page, total }, () => { this.pagenationCallback(page); });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      const token_type_tag = this.state.tokenTypeTag;
      this.props.getTokenHolderList({ token_type_tag, page, total }, () => { this.pagenationCallback(page); });
    }
  };

  pagenationCallback = (page: number) => {
    this.setState({ currentPage: page });
    window.history.replaceState(null, '', `/${getNetwork()}/tokens/holders/${this.state.tokenTypeTag}/${page}`);
  };

  render() {
    const { tokenHolderList, classes, t, className, isLoadingMore } = this.props;
    const isInitialLoad = !tokenHolderList;
    const hits = tokenHolderList && tokenHolderList.contents || [];
    const holders = hits.sort((a: any, b: any) => b.amount - a.amount);
    const tokenHolderListTable = holders.length ? (
      <HolderTable
        tokenHolders={tokenHolderList}
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
          title={t('token.holderList')}
          name={t('token.holderList')}
          pluralName={t('token.holderList')}
          content={
            <div>
              {isInitialLoad ? <Loading /> : tokenHolderListTable}
              <div className={classes.pagerArea}>
                <Pagination
                  page={this.state.currentPage}
                  pageSize={20}
                  currentPageSize={holders == null ? null : holders.length}
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
