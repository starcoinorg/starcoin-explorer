import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';

interface NetworkRedirectRouterProps {
  computedMatch: any;
}

class NetworkRedirectRouter extends PureComponent<NetworkRedirectRouterProps> {
  render() {
    const { computedMatch: match } = this.props;
    const oldNetwork = localStorage.getItem('network');
    const newNetwork = match.params.network;
    if (oldNetwork !== newNetwork) {
      localStorage.setItem('network', match.params.network);
      window.location.href = '/';
    }
    return (
      <Redirect push to="/" />
    );
  }
}

export default NetworkRedirectRouter;
