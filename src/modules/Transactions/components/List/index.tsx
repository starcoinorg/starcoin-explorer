import React, { PureComponent } from 'react';
import BaseRouteLink from "@/common/BaseRouteLink";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
// import withLoading from '@/common/LoadingMasker/withLoading';
// import BaseRouteLink from "@/common/BaseRouteLink";

interface IndexProps {
  transactionList: any;
  getTransactionList: (data: any, callback?: any) => any;
}

interface IndexState {
  currentPage: number
}

class Index extends PureComponent<IndexProps, IndexState> {
  static defaultProps = {
    transactionList: null,
    getTransactionList: () => {}
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
    this.props.getTransactionList({ page })
  };

  pagination = (type: string) => {
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.getTransactionList({ page}, () => { this.setState({ currentPage: page}) });
    }else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.getTransactionList({ page}, () => { this.setState({ currentPage: page}) });
    }

  };

  render() {
    const { transactionList } = this.props;
    if (!transactionList) {
      return null;
    }
    const hits = transactionList.hits.hits;
    const size = 20;
    const from = (this.state.currentPage -1) * size + 1;
    const to = this.state.currentPage * size;
    return (
      <React.Fragment>
        <div>
          Transactions List
          <p>
            {from} - {to}
            <IconButton aria-label="prev" onClick={() => this.pagination('prev')} disabled={this.state.currentPage === 1} >
              <ArrowBackIos />
            </IconButton>
            <IconButton aria-label="next" onClick={() => this.pagination('next')}>
              <ArrowForwardIos />
            </IconButton>
          </p>
          <ul>
          {
            hits.map((item: any) => {
              const url = `/transactions/detail/${item._id}`;
              return(
                <li key={item._id}>
                  <BaseRouteLink to={url}>{item._id}</BaseRouteLink>
                </li>
              )
            })
          }
          </ul>
          <hr />
          <h3>xhr response:</h3>
          <div style={{ width: '80%', height: '400px', overflow: 'auto' }}>
            <pre>
              {JSON.stringify(transactionList,null, 2)}
            </pre>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Index;