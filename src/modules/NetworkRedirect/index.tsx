import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';

interface NetworkRedirectRouterProps {
  location: any;
}

class NetworkRedirectRouter extends PureComponent<NetworkRedirectRouterProps> {
  render() {
    const { location } = this.props;
    const redirectNetwork = location.pathname.slice(1);
    localStorage.setItem('network', redirectNetwork);
    return (
      <>
        <Helmet>
          <title>Home - {redirectNetwork}</title>
        </Helmet>
        <Redirect
          to={{
            pathname: '/',
            state: {
              network: redirectNetwork,
            },
          }}
        />
      </>
    );
  }
}

export default NetworkRedirectRouter;
