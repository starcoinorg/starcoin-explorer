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
import Layout from '@/common/Layout';
import Loading from '@/common/Loading';
import './index.css';
import store, { history } from './rootStore';

const Search = lazy(() => import('./modules/Search/adapter'));
const Home = lazy(() => import('./modules/Home/adapter'));
const NetworkRedirect = lazy(() => import('./modules/NetworkRedirect/index'));
const Blocks = lazy(() => import('./modules/Blocks/containers'));
const UncleBlocks = lazy(() => import('./modules/UncleBlocks/containers'));
const Transactions = lazy(() => import('./modules/Transactions/containers'));
const PendingTransactions = lazy(() => import('./modules/PendingTransactions/containers'));
const Ecosystems = lazy(() => import('./modules/Ecosystems'));
const Faq = lazy(() => import('./modules/Faq'));
const Tools = lazy(() => import('./modules/Tools'));
const Terms = lazy(() => import('./modules/Terms'));
const Address = lazy(() => import('./modules/Address/adapter'));
const Error404 = lazy(() => import('./modules/Error404'));

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
          {props.title || 'Starcoin Explorer'}
        </title>
      </Helmet>
      <Suspense fallback={<Loading />}>
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
        <RouteWithLayout path={withBaseRoute('/search/:keyword')} title="Search" layout={MainLayout} component={Search} />
        <RouteWithLayout path={withBaseRoute('/:network/blocks')} title="Block" layout={MainLayout} component={Blocks} />
        <RouteWithLayout path={withBaseRoute('/:network/uncleblocks')} title="UncleBlocks" layout={MainLayout} component={UncleBlocks} />
        <RouteWithLayout path={withBaseRoute('/:network/transactions')} title="Transaction" layout={MainLayout} component={Transactions} />
        <RouteWithLayout path={withBaseRoute('/:network/pending_transactions')} title="PendingTransaction" layout={MainLayout} component={PendingTransactions} />
        <RouteWithLayout exact path={withBaseRoute('/barnard')} title="NetworkRedirect" layout={MainLayout} component={NetworkRedirect} />
        <RouteWithLayout exact path={withBaseRoute('/halley')} title="NetworkRedirect" layout={MainLayout} component={NetworkRedirect} />
        <RouteWithLayout exact path={withBaseRoute('/proxima')} title="NetworkRedirect" layout={MainLayout} component={NetworkRedirect} />
        <RouteWithLayout exact path={withBaseRoute('/main')} title="Home" layout={MainLayout} component={NetworkRedirect} />
        <RouteWithLayout exact path={withBaseRoute('/ecosystems')} title="Ecosystem" layout={MainLayout} component={Ecosystems} />
        <RouteWithLayout exact path={withBaseRoute('/tools')} title="Tools" layout={MainLayout} component={Tools} />
        <RouteWithLayout exact path={withBaseRoute('/faq')} title="Faq" layout={MainLayout} component={Faq} />
        <RouteWithLayout exact path={withBaseRoute('/terms')} title="Terms" layout={MainLayout} component={Terms} />
        <RouteWithLayout path={withBaseRoute('/:network/address/:hash')} title="Address" layout={MainLayout} component={Address} />
        <RouteWithLayout exact path={withBaseRoute('/error')} title="404" layout={MainLayout} component={Error404} />
        <RouteWithLayout path={undefined} title="404" layout={MainLayout} component={Error404} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
