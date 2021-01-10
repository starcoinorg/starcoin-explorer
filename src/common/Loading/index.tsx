import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('md')]: {
    pad: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  [theme.breakpoints.up('md')]: {
    pad: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  pad: {},
  progress: {
    marginTop: theme.spacing(2),
    width: theme.spacing(16),
  },
});

interface ExternalProps {
  disablePadding?: boolean,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { disablePadding, className, classes } = this.props;
    return (
      <div
        className={classNames(classes.root, className, {
          [classes.pad]: !disablePadding,
        })}
      >
        <LinearProgress className={classes.progress} />
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
