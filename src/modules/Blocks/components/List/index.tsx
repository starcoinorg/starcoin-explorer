import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
// import withLoading from '@/common/LoadingMasker/withLoading';
import { withStyles } from '@material-ui/core/styles';
import BlockTable from '../BlockTable';

interface IndexProps {
  classes: any;
  blockList: any;
  getBlockList: (data: any, callback?: any) => any;
}

interface IndexState {
  currentPage: number
}

const useStyles = () => ({
  table: {
    minWidth: 700,
  },
});

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    blockList: null,
    getBlockList: () => {}
  };

  constructor(props: IndexProps) {
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

  render() {
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
        Blocks List
        <BlockTable
          blocks={blocks}
          sizeVisibleAt="xs"
          validatorVisibleAt="md"
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
}

export default withStyles(useStyles)(Index);
