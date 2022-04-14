import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import List from '../components/List/adapter';
import Detail from '../components/Detail/adapter';
import HolderList from '../components/HolderList/adapter';
import TransactionList from '../components/TransactionList/adapter';

interface TokensRouterProps {
  computedMatch: any;
}

class TokensRouter extends PureComponent<TokensRouterProps> {
  render() {
    const { computedMatch: match } = this.props;
    return (
      <Switch>
        <Route path={`${match.path}/transactions/:token_type_tag/:page`}
               render={(props: any) => (<TransactionList {...props} />)} />
        <Route path={`${match.path}/holders/:token_type_tag/:page`}
               render={(props: any) => (<HolderList {...props} />)} />
        <Route path={`${match.path}/detail/:token_type_tag`} render={(props: any) => (<Detail {...props} />)} />
        <Route path={`${match.path}/:page`} render={(props: any) => (<List {...props} />)} />
      </Switch>
    );
  }
}

export default TokensRouter;
