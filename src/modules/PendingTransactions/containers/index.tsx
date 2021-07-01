import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import List from '../components/List/adapter';
import Detail from '../components/Detail/adapter';

interface PendingTransactionsRouterProps {
  computedMatch: any;
}

class PendingTransactionsRouter extends PureComponent<PendingTransactionsRouterProps> {
  render() {
    const { computedMatch: match } = this.props;
    return (
      <Switch>
        <Route path={`${match.path}/detail/:hash`} render={(props: any) => (<Detail {...props} />)} />
        <Route exac path={`${match.path}`} render={(props: any) => (<List {...props} />)} />
      </Switch>
    );
  }
}

export default PendingTransactionsRouter;
