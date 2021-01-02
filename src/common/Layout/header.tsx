import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BaseRouteLink from '../BaseRouteLink';

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
