import React from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import TimeAgo from '@/common/TimeAgo';

const useStyles = () => createStyles({
  root: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

interface ExternalProps {
  blockTime: number,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { blockTime, className, classes } = this.props;
    return (
      <TimeAgo
        className={classNames(className, classes.root)}
        time={blockTime}
      />
    );
  }
}

export default withStyles(useStyles)(Index);
