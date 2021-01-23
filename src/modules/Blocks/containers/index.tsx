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
    console.log('BlocksRouter');
    console.log('match', match);
    console.log('props', this.props);
    return (
      <Switch>
        <Route path={`${match.path}/detail/:hash`} render={(props: any) => (<Detail hash={props.match.params.hash} {...props} />)} />
        <Route exac path={`${match.path}`} render={(props: any) => (<List {...props} />)} />
      </Switch>
    );
  }
}

export default BlocksRouter;
