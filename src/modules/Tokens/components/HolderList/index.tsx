import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { createStyles, withStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { getNetwork } from '@/utils/helper';
import { getTokenPrecision } from '@/utils/sdk';
import Loading from '@/common/Loading';
import ListView from '@/common/View/ListView';
import Pagination from '@/common/View/Pagination';
import CenteredView from '@/common/View/CenteredView';
import HolderTable from '../HolderTable';
import { withRouter,RoutedProps } from '@/utils/withRouter';

const useStyles = (theme: any) => createStyles({
  pagerArea: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.mode === "dark"? theme.palette.background.default : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
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

interface Props extends ExternalProps, InternalProps ,RoutedProps {
}

interface IndexState {
  tokenTypeTag: string,
  tokenPrecision: number,
  currentPage: number
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    tokenHolderList: null,
    isLoadingMore: undefined,
    getTokenHolderList: () => {
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: parseInt(props.params.page, 10) || 1,
      tokenPrecision: 1,
      tokenTypeTag: props.params.token_type_tag || '',
    };
  }

  componentDidMount() {
    this.fetchTokenPrecision(this.state.tokenTypeTag);
    this.fetchListPage(this.state.tokenTypeTag, this.state.currentPage);
  }

  fetchListPage = (token_type_tag: string, page: number) => {
    this.props.getTokenHolderList({ token_type_tag, page });
  };

  fetchTokenPrecision = (token_type_tag: string) => {
    if (token_type_tag) {
      getTokenPrecision(token_type_tag).then(data => {
        if (data) {
          this.setState({ tokenPrecision: parseInt(data[0] as string, 10) });
        } else {
          console.log('get precision failed');
        }
      });
    }
  };

  pagination = (type: string) => {
    const total = this.props.tokenHolderList && this.props.tokenHolderList.total || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      const token_type_tag = this.state.tokenTypeTag;
      this.fetchTokenPrecision(token_type_tag);
      this.props.getTokenHolderList({ token_type_tag, page, total }, () => {
        this.pagenationCallback(page);
      });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      const token_type_tag = this.state.tokenTypeTag;
      this.fetchTokenPrecision(token_type_tag);
      this.props.getTokenHolderList({ token_type_tag, page, total }, () => {
        this.pagenationCallback(page);
      });
    }
  };

  pagenationCallback = (page: number) => {
    this.setState({ currentPage: page });
    window.history.replaceState(null, '', `/${getNetwork()}/tokens/holders/${this.state.tokenTypeTag}/${page}`);
  };

  render() {
    const { tokenHolderList, classes, t, className, isLoadingMore } = this.props;
    const precision = this.state.tokenPrecision ? this.state.tokenPrecision : 1;
    const isInitialLoad = !tokenHolderList;
    const hits = tokenHolderList && tokenHolderList.contents || [];
    const holders = hits.sort((a: any, b: any) => b.amount - a.amount);
    const tokenHolderListTable = holders.length ? (
      <HolderTable
        tokenHolders={tokenHolderList}
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

export default withStyles(useStyles)(withTranslation()(withRouter(Index)));
