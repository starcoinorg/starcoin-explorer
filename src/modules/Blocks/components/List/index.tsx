import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
// import withLoading from '@/common/LoadingMasker/withLoading';
import CommonList from '@/common/List';
import BlockTable from '../Table';

interface ExternalProps {
  className?: string,
}

interface InternalProps {
  blockList: any;
  getBlockList: (data: any, callback?: any) => any;
}

interface Props extends ExternalProps, InternalProps {}

interface IndexState {
  currentPage: number
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    blockList: null,
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
    console.log('fetchListPage', page);
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

  generateList() {
    const { blockList } = this.props;
    if (!blockList) {
      return null;
    }
    const hits = blockList.hits.hits;
    const blocks = hits.sort((a: any, b: any) => b._source.header.number - a._source.header.number);
    const size = 20;
    const from = (this.state.currentPage - 1) * size + 1;
    const to = this.state.currentPage * size;
    return (
      <div>
        <BlockTable
          blocks={blocks}
          sizeVisibleAt="xs"
          authorVisibleAt="md"
        />
        <p>
          {from} - {to}
          <IconButton aria-label="prev" onClick={() => this.pagination('prev')} disabled={this.state.currentPage === 1}>
            <ArrowBackIos />
          </IconButton>
          <IconButton aria-label="next" onClick={() => this.pagination('next')}>
            <ArrowForwardIos />
          </IconButton>
        </p>
      </div>
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div>
        <Helmet>
          <title>Browse Blocks</title>
        </Helmet>
        <CommonList
          className={className}
          name="Block"
          pluralName="Blocks"
          content={this.generateList()}
          // content={
          //   <BlockPagingView
          //     blocks={blocks}
          //     isInitialLoad={currentProps == null}
          //     isLoadingMore={props == null}
          //     page={page}
          //     hasNextPage={hasNextPage}
          //     hasPreviousPage={hasPreviousPage}
          //     pageSize={PAGE_SIZE}
          //     onUpdatePage={onUpdatePage}
          //   />
          // }
        />
      </div>
    );
  }
}

export default Index;
