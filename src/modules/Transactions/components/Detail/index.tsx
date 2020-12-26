import React, { PureComponent } from 'react';
// import withLoading from '@/common/LoadingMasker/withLoading';
import BaseRouteLink from "@/common/BaseRouteLink";

interface IndexProps {
  match: any;
  transaction: any;
  getTransaction: (data: any, callback?: any) => any;
}

class Index extends PureComponent<IndexProps> {
  static defaultProps = {
    match: {},
    transaction: null,
    getTransaction: () => {}
  };

  componentDidMount() {
    const hash = this.props.match.params.hash;
    this.props.getTransaction({ hash })
  }

  render() {
    const hash = this.props.match.params.hash;
    return (
      <React.Fragment>
        <div>
          Transactions Detail
          <p>
            go to <BaseRouteLink to="../">List</BaseRouteLink>
          </p>
          <p>hash={hash}</p>
          <hr />
          <h3>xhr response:</h3>
          <div style={{ width: '80%', height: '400px', overflow: 'auto' }}>
            <pre>
              {JSON.stringify(this.props.transaction,null, 2)}
            </pre>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Index;