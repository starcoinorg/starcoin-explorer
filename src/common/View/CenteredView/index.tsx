import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('sm')]: {
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
  children?: any,
  className?: string,
}

interface InternalProps {
  classes: any,
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
        justify="center"
      >
        <Grid className={classes.gridItem} item xs={12} sm={12} md={10}>
          <div className={classes.col}>{children}</div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(useStyles)(Index);
