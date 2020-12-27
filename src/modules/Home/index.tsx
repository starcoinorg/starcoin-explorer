import React, { PureComponent } from 'react';
import BaseRouteLink from "@/common/BaseRouteLink";
// import withLoading from '@/common/LoadingMasker/withLoading';
// import BaseRouteLink from "@/common/BaseRouteLink";

interface IndexProps {
  blockList: any;
  getBlockList: (data: any, callback?: any) => any;
  transactionList: any;
  getTransactionList: (data: any, callback?: any) => any;
}


class Index extends PureComponent<IndexProps> {
  static defaultProps = {
    blockList: null,
    getBlockList: () => {},
    transactionList: null,
    getTransactionList: () => {}
  };

  componentDidMount() {
    this.props.getBlockList({ page: 1 });
    this.props.getTransactionList({ page: 1 });
  }

  render() {
    const { blockList, transactionList } = this.props;
    if (!blockList || !transactionList) {
      return null;
    }
    const hitsBlocks = blockList.hits.hits;
    const hitsTransactions = transactionList.hits.hits;
    return (
      <React.Fragment>
        <div>
          Blocks List <BaseRouteLink to="/blocks">View All</BaseRouteLink>
          <ul>
          {
            hitsBlocks.map((item: any) => {
              const url = `/blocks/detail/${item._id}`;
              return(
                <li>
                  <BaseRouteLink to={url}>{item._id}</BaseRouteLink>
                </li>
              )
            })
          }
          </ul>
        </div>
        <div>
          Transaction List <BaseRouteLink to="/transactions">View All</BaseRouteLink>
          <ul>
            {
              hitsTransactions.map((item: any) => {
                const url = `/transactions/detail/${item._id}`;
                return(
                  <li>
                    <BaseRouteLink to={url}>{item._id}</BaseRouteLink>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default Index;