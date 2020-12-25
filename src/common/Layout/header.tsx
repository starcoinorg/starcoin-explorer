/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import BaseRouteLink from '../BaseRouteLink'
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <Typography className={classes.root}>
      <BaseRouteLink to="/">Home</BaseRouteLink>
      <BaseRouteLink to="/blocks">Blocks</BaseRouteLink>
      <BaseRouteLink to="/transactions">Transactions</BaseRouteLink>
      <BaseRouteLink to="/ecosystems">Ecosystems</BaseRouteLink>
      <BaseRouteLink to="/faq">Faq</BaseRouteLink>
    </Typography>
  );
}
