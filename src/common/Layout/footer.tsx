import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const year = new Date().getFullYear();

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  root: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  secondRow: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '90%',
  },
  copyright: {
    // color: theme.custom.colors.common.white,
  },
  icon: {
    // fill: theme.custom.colors.common.white,
    paddingRight: theme.spacing(1 / 2),
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.secondRow}>
        <Typography className={classes.copyright} variant="caption">
          StarCoin © 2019-{year}
        </Typography>
      </div>
    </div>
  );
}
