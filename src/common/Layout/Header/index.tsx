import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HeaderUpMD from './HeaderUpMD';
import HeaderDownMD from './HeaderDownMD';

const useStyles = makeStyles((theme) => ({
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
  headerUpMD: {
  },
  headerDownMD: {},
}));

export default function Index() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.headerUpMD}>
        <HeaderUpMD useSuspense={false} />
      </div>
      <div className={classes.headerDownMD}>
        <HeaderDownMD />
      </div>
    </div>
  );
}
