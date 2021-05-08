import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';

interface NetworkRedirectRouterProps {
  computedMatch: any;
}

class NetworkRedirectRouter extends PureComponent<NetworkRedirectRouterProps> {
  render() {
    const { computedMatch: match } = this.props;
    const redirectNetwork = match.params.network;
    localStorage.setItem('network', redirectNetwork);
    return (
      <Redirect
        to={{
          pathname: '/',
          state: {
            network: redirectNetwork
          }
        }}
      />
    );
  }
}

export default NetworkRedirectRouter;
