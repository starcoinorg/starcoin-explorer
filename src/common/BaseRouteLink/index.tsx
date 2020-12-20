import React from 'react';
import { NavLink } from 'react-router-dom';
import omit from 'lodash/omit';
import { withBaseRoute } from '@/utils/helper';

export default function BaseRouteLink(props: any) {
  const restProps = omit(props, ['to', 'children', 'abs']);
  const path = props.abs ? props.to : withBaseRoute(props.to);
  return (
    <NavLink {...restProps} to={path}>
      {props.children}
    </NavLink>
  );
}