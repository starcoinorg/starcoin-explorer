import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';

const useStyles = (theme: any) =>
  createStyles({
    [theme.breakpoints.down('md')]: {
      root: {
        padding: theme.spacing(1),
      },
    },
    [theme.breakpoints.up('sm')]: {
      root: {
        padding: theme.spacing(2),
      },
    },
    root: {
      margin: 0,
      width: '100%',
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.background.default
          : undefined,
      color: theme.palette.getContrastText(theme.palette.background.paper),
    },
    col: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      maxWidth: 1200,
      width: '100%',
    },
    gridItem: {
      display: 'flex',
      justifyContent: 'center',
    },
  });

interface ExternalProps {
  children?: any;
  className?: string;
}

interface InternalProps {
  classes: any;
}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { children, className, classes } = this.props;
    return (
      <Grid
        className={classNames(className, classes.root)}
        container
        spacing={0}
        justifyContent="center"
      >
        <Grid className={classes.gridItem} item xs={12} sm={12} md={10}>
          <div className={classes.col}>{children}</div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(useStyles)(Index);
