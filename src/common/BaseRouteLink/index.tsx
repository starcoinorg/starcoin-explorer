import React from 'react';
import { NavLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import omit from 'lodash/omit';
import { withBaseRoute } from '@/utils/helper';

export default function BaseRouteLink(props: any) {
  const restProps = omit(props, ['to', 'children', 'abs']);
  const path = props.abs ? props.to : withBaseRoute(props.to);
  return (
    <Link component={NavLink} to={path}>
      {props.children}
    </Link>
  );
}