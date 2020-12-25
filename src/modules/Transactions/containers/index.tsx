import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import List from '../components/List';
import Detail from '../components/Detail';

interface TransactionsRouterProps {
  computedMatch: any;
}

class TransactionsRouter extends PureComponent<TransactionsRouterProps> {
  render() {
    console.log('TransactionsRouter', this.props);
    // TODO: match is not working
    const { computedMatch: match } = this.props;
    console.log(match);
    return (
      <Switch>
        <Route path={`${match.path}/detail/:hash`} render={(props: any) => (<Detail {...props} />)} />
        <Route exac path={`${match.path}`} render={(props: any) => (<List {...props} />)} />
      </Switch>
    );
  }
}

export default  TransactionsRouter;