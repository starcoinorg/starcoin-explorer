import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import List from '../components/List/adapter';
import Detail from '../components/Detail/adapter';

interface BlocksRouterProps {
  computedMatch: any;
}

class BlocksRouter extends PureComponent<BlocksRouterProps> {
  render() {
    const { computedMatch: match } = this.props;
    return (
      <Switch>
        <Route path={`${match.path}/height/:height/:author`} render={(props: any) => (<Detail {...props} />)} />
        <Route path={`${match.path}/hash/:hash`} render={(props: any) => (<Detail {...props} />)} />
        <Route path={`${match.path}/:page`} render={(props: any) => (<List {...props} />)} />
      </Switch>
    );
  }
}

export default BlocksRouter;
