import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Loading from '@/common/Loading';
import ListView from '@/common/View/ListView';
import Pagination from '@/common/View/Pagination';
import BlockTable from '../Table';

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
  blockList: any,
  isLoadingMore: boolean,
  getBlockList: (data: any, callback?: any) => any,
  classes: any,
}

interface Props extends ExternalProps, InternalProps {}

interface IndexState {
  currentPage: number
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    blockList: null,
    isLoadingMore: false,
    getBlockList: () => {}
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }

  componentDidMount() {
    this.fetchListPage(this.state.currentPage);
  }

  fetchListPage = (page: number) => {
    this.props.getBlockList({ page });
  };

  pagination = (type: string) => {
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.getBlockList({ page }, () => { this.setState({ currentPage: page }); });
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.getBlockList({ page }, () => { this.setState({ currentPage: page }); });
    }
  };

  render() {
    const { className } = this.props;
    const { blockList, classes } = this.props;
    const isInitialLoad = !blockList;
    const hits = blockList && blockList.hits.hits || [];
    const blocks = hits.sort((a: any, b: any) => b._source.header.number - a._source.header.number);
    return (
      <div>
        <Helmet>
          <title>Browse Blocks</title>
        </Helmet>
        <ListView
          className={className}
          name="Block"
          pluralName="Blocks"
          content={
            <div>
              {isInitialLoad ? <Loading /> : <BlockTable
                blocks={blocks}
                sizeVisibleAt="xs"
                authorVisibleAt="md"
              />}
              <div className={classes.pagerArea}>
                <Pagination
                  page={this.state.currentPage}
                  pageSize={20}
                  currentPageSize={blocks.length}
                  hasPreviousPage={this.state.currentPage > 1}
                  hasNextPage={!!true}
                  onPrevPage={() => this.pagination('prev')}
                  onNextPage={() => this.pagination('next')}
                  isLoading={this.props.isLoadingMore}
                />
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
