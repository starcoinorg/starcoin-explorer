import React, { PureComponent } from 'react';
// import withLoading from '@/common/LoadingMasker/withLoading';

interface IndexProps {
  computedMatch: any;
  block: any;
  getBlock: (data: any, callback?: any) => any;
  transaction: any;
  getTransaction: (data: any, callback?: any) => any;
  pushLocation: (data: any) => any;
}

class Index extends PureComponent<IndexProps> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    computedMatch: {},
    block: null,
    getBlock: () => {},
    transaction: null,
    getTransaction: () => {},
    pushLocation: () => {},
  };

  componentDidMount() {
    const hash = this.props.computedMatch.params.hash;
    this.props.getBlock({ hash });
    this.props.getTransaction({ hash });
  }

  render() {
    const hash = this.props.computedMatch.params.hash;
    const { block, transaction } = this.props;
    if (!block || !transaction) {
      return null;
    }
    let url;
    let showNone = true;
    if (block.hits.hits.length > 0) {
      if (block.hits.hits[0]._id === hash) {
        url = `/blocks/detail/${block.hits.hits[0]._id}`;
      } else {
        showNone = false;
      }
    }
    if (transaction.hits.hits.length > 0) {
      if (transaction.hits.hits[0]._id === hash) {
        url = `/transactions/detail/${transaction.hits.hits[0]._id}`;
      } else {
        showNone = false;
      }
    }
    if (transaction.hits.hits.length > 0 && transaction.hits.hits[0]._id === hash) {
      url = `/transactions/detail/${transaction.hits.hits[0]._id}`;
    }
    if (url) {
      this.props.pushLocation(url);
    }
    if (!url && showNone) {
      return (
        <div>
          <h3>Sorry, that page was not found.</h3>
          Try going back to where you were or heading to the home page.
        </div>
      );
    }
    return null;
  }
}

export default Index;
