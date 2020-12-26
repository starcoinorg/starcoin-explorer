import React, { PureComponent } from 'react';
import BaseRouteLink from "@/common/BaseRouteLink";

class Index extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <div>
          Transactions List
          <p>
            go to <BaseRouteLink to="/transactions/detail/0x2814d227cc892a0706a26bc76184459d550e097ba3e73c1af0e299136192b11c">Detail</BaseRouteLink>
          </p>
        </div>
      </React.Fragment>
    );
  }
}

export default Index;