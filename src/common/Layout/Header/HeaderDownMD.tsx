import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BaseRouteLink from '@/common/BaseRouteLink';

const useStyles = makeStyles((theme: any) => ({
  [theme.breakpoints.down('md')]: {
    headerUpMD: {
      display: 'none',
    },
    headerDownMD: {
      display: 'initial',
    },
  },
  [theme.breakpoints.up('md')]: {
    headerUpMD: {
      display: 'initial',
    },
    headerDownMD: {
      display: 'none',
    },
  },
  headerUpMD: {},
  headerDownMD: {},
}));

export default function HeaderDownMD() {
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
