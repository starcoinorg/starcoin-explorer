import React, { Fragment, PureComponent } from 'react';
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
      <Fragment>
        <Switch>
          <Route path={`${match.path}/detail/:hash`} render={(props: any) => (<Detail {...props} />)} />
          <Route exac path={`${match.path}`} render={(props: any) => (<List {...props} />)} />
        </Switch>
      </Fragment>
    );
  }
}

export default  BlocksRouter;