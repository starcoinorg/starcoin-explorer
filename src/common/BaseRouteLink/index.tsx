import React from 'react';
import { NavLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { withBaseRoute } from '@/utils/helper';
import omit from 'lodash/omit';

export default function BaseRouteLink(props: any) {
  const path = props.abs ? props.to : withBaseRoute(props.to);
  const rest = omit(props, ['abs', 'to']);
  return (
    <Link component={NavLink} to={path} {...rest}>
      {props.children}
    </Link>
  );
}
