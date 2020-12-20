import React, { FC, memo } from 'react';
import BaseRouteLink from '../BaseRouteLink';
export interface LayoutProps {
  children?: React.ReactNode
}

const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;
  return (
    <React.Fragment>
      <div>
        <BaseRouteLink to="/">Home</BaseRouteLink>
        <BaseRouteLink to="/blocks">Blocks</BaseRouteLink>
        <BaseRouteLink to="/transactions">Transactions</BaseRouteLink>
        <BaseRouteLink to="/ecosystems">Ecosystems</BaseRouteLink>
        <BaseRouteLink to="/faq">Faq</BaseRouteLink>
      </div>
      <div>
        {children}
      </div>
    </React.Fragment>
  );
};

export default memo(Layout);