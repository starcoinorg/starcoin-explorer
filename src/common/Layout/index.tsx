import React, { FC, memo } from 'react';
import Header from './header';

export interface LayoutProps {
  children?: React.ReactNode
}

const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;
  return (
    <div>
      <Header />
      <hr />
      <div>
        {children}
      </div>
    </div>
  );
};

export default memo(Layout);
