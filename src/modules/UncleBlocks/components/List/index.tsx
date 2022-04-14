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
import BlockTable from '../Table';

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
  blockList: any,
  uncleBlockList: any,
  isLoadingMore: boolean,
  getUncleBlockList: (contents: any, callback?: any) => any,
  classes: any,
  t: any,
  match: any,
}

interface Props extends ExternalProps, InternalProps {
}

interface IndexState {
  currentPage: number;
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    blockList: null,
    uncleBlockList: null,
    isLoadingMore: undefined,
    getUncleBlockList: () => {
    },
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
    this.props.getUncleBlockList({ page });
  };

  pagination = (type: string) => {
    const total = this.props.uncleBlockList && this.props.uncleBlockList.total.value || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.getUncleBlockList({ page, total }, () => {
        this.pagenationCallback(page);
      });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.getUncleBlockList({ page, total }, () => {
        this.pagenationCallback(page);
      });
    }
  };

  pagenationCallback = (page: number) => {
    this.setState({ currentPage: page });
    window.history.replaceState(null, '', `/${getNetwork()}/uncleblocks/${page}`);
  };

  render() {
    const { uncleBlockList, classes, t, className, isLoadingMore } = this.props;
    const isInitialLoad = !uncleBlockList;
    const hits = uncleBlockList && uncleBlockList.contents || [];
    const blocks = hits.sort((a: any, b: any) => b.header.number - a.header.number);
    const uncleBlocksList = blocks.length ? (
      <BlockTable
        blocks={blocks}
        sizeVisibleAt='xs'
        authorVisibleAt='md'
      />
    ) : (
      <CenteredView>
        <div className={classes.header}>
          <Typography variant='h5' gutterBottom className={classes.title}>
            {t('uncleblock.NoUncleBlockData')}
          </Typography>
        </div>
      </CenteredView>
    );
    return (
      <div>
        <Helmet>
          <title>{t('header.uncleblocks')}</title>
        </Helmet>
        <ListView
          className={className}
          title={t('uncleblock.title')}
          name={t('uncleblock.title')}
          pluralName={t('uncleblock.title')}
          content={
            <div>
              {isInitialLoad ? <Loading /> : uncleBlocksList}
              <div className={classes.pagerArea}>
                <Pagination
                  page={this.state.currentPage}
                  pageSize={20}
                  currentPageSize={blocks == null ? null : blocks.length}
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
