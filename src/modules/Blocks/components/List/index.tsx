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
  isLoadingMore: boolean,
  getBlockList: (contents: any, callback?: any) => any,
  classes: any,
  t: any,
  match: any,
}

interface Props extends ExternalProps, InternalProps {
}

interface IndexState {
  currentPage: number,
  currentStartHeight: any
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    blockList: null,
    isLoadingMore: undefined,
    getBlockList: () => {
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: parseInt(props.match.params.page, 10) || 1,
      currentStartHeight: '',
    };
  }

  componentDidMount() {
    this.fetchListPage(this.state.currentStartHeight);
  }

  fetchListPage = (start_height: number) => {
    this.props.getBlockList({ start_height });
  };

  pagination = (type: string) => {
    // const total = this.props.blockList && this.props.blockList.total.value || 0;
    const height = this.props.blockList && this.props.blockList.contents[0].header.number || '';
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      const start_height = height + 19;
      this.props.getBlockList({ start_height }, () => {
        this.pagenationCallback(page, start_height);
      });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      const start_height = height - 19;
      this.props.getBlockList({ start_height }, () => {
        this.pagenationCallback(page, start_height);
      });
    }
  };

  pagenationCallback = (page: number, height: any) => {
    this.setState({ currentPage: page });
    this.setState({ currentStartHeight: height });
    window.history.replaceState(null, '', `/${getNetwork()}/blocks/${page}`);
  };

  render() {
    const { blockList, classes, t, className, isLoadingMore } = this.props;
    const isInitialLoad = !blockList;
    const hits = blockList && blockList.contents || [];
    const blocks = hits.sort((a: any, b: any) => b.header.number - a.header.number);
    const blocksList = blocks.length ? (
      <BlockTable
        blocks={blocks}
        sizeVisibleAt='xs'
        authorVisibleAt='md'
      />
    ) : (
      <CenteredView>
        <div className={classes.header}>
          <Typography variant='h5' gutterBottom className={classes.title}>
            {t('block.NoBlockData')}
          </Typography>
        </div>
      </CenteredView>
    );
    return (
      <div>
        <Helmet>
          <title>{t('header.blocks')}</title>
        </Helmet>
        <ListView
          className={className}
          title={t('header.blocks')}
          name={t('header.blocks')}
          pluralName={t('header.blocks')}
          content={
            <div>
              {isInitialLoad ? <Loading /> : blocksList}
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
