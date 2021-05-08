import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';

interface NetworkRedirectRouterProps {
  location: any;
}

class NetworkRedirectRouter extends PureComponent<NetworkRedirectRouterProps> {
  render() {
    const { location } = this.props;
    const redirectNetwork = location.pathname.slice(1);
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
