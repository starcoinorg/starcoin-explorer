import React, { PureComponent } from 'react';
import {Navigate} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface NetworkRedirectRouterProps {
  path: any;
}

class NetworkRedirectRouter extends PureComponent<NetworkRedirectRouterProps> {
  render() {
    const { path } = this.props;
    const redirectNetwork = path;
    localStorage.setItem('network', redirectNetwork);
    return (
      <>
        <Helmet>
          <title>Home - {redirectNetwork}</title>
        </Helmet>
        <Navigate to="/" state={{network: redirectNetwork}}/>
      </>
    );
  }
}

export default NetworkRedirectRouter;
