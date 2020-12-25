import React, { FC, memo } from 'react';
import BaseRouteLink from '../BaseRouteLink';
export interface LayoutProps {
  children?: React.ReactNode
}

const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;
  return (
    <div>
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
    </div>
  );
};

export default memo(Layout);