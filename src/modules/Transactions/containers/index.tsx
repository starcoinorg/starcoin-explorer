import React, { Fragment, PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import List from '../components/List';
import Detail from '../components/Detail/adapter';

interface TransactionsRouterProps {
  computedMatch: any;
}

class TransactionsRouter extends PureComponent<TransactionsRouterProps> {
  render() {
    const { computedMatch: match } = this.props;
    return (
      <Fragment>
        <Switch>
          <Route path={`${match.path}/detail/:hash`} render={(props: any) => (<Detail {...props} />)} />
          <Route exac path={`${match.path}`} render={(props: any) => (<List {...props} />)} />
        </Switch>
      </Fragment>
    );
  }
}

export default  TransactionsRouter;