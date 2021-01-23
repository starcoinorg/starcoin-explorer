import './utils/i18n';
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import omit from 'lodash/omit';
import { withBaseRoute } from '@/utils/helper';
import Layout from './common/Layout';
import './index.css';
import store, { history } from './rootStore';

const Search = lazy(() => import('./modules/Search/adapter'));
const Home = lazy(() => import('./modules/Home/adapter'));
const Blocks = lazy(() => import('./modules/Blocks/containers'));
const Transactions = lazy(() => import('./modules/Transactions/containers'));
const Ecosystems = lazy(() => import('./modules/Ecosystems'));
const Faq = lazy(() => import('./modules/Faq'));
const Address = lazy(() => import('./modules/Address/adapter'));

const RouteWithLayout = (props: any) => {
  const Component = props.component;
  const Layout = props.layout;
  const title = props.title;
  const rest = omit(props, ['component', 'layout', 'title']);

  return (
    <Layout title={title}><Component {...rest} /></Layout>
  );
};

const MainLayout = (props: any) => {
  return (
    <Layout>
      <Helmet>
        <title>
          {props.title || 'Starcoin'}
        </title>
      </Helmet>
      <Suspense fallback={<div>Loading...</div>}>
        {props.children}
      </Suspense>
    </Layout>
  );
};

MainLayout.prototype = {
  children: PropTypes.element.isRequired
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <RouteWithLayout exact path={withBaseRoute('/')} title="Home" layout={MainLayout} component={Home} />
        <RouteWithLayout path={withBaseRoute('/search/:hash')} title="Search" layout={MainLayout} component={Search} />
        <RouteWithLayout path={withBaseRoute('/blocks')} title="Block" layout={MainLayout} component={Blocks} />
        <RouteWithLayout path={withBaseRoute('/transactions')} title="Transaction" layout={MainLayout} component={Transactions} />
        <RouteWithLayout exact path={withBaseRoute('/ecosystems')} title="Ecosystem" layout={MainLayout} component={Ecosystems} />
        <RouteWithLayout exact path={withBaseRoute('/faq')} title="Faq" layout={MainLayout} component={Faq} />
        <RouteWithLayout path={withBaseRoute('/address/:hash')} title="Address" layout={MainLayout} component={Address} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
