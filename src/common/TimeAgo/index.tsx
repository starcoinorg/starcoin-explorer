import React from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import formatTime from '@/utils/formatTime';

const useStyles = () => createStyles({
  root: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

interface ExternalProps {
  time: number,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {}

interface IndexState {
  status: boolean,
}

class Index extends React.PureComponent<Props, IndexState> {
  private timer: number | null;

  constructor(props: Props) {
    super(props);
    this.timer = null;
    this.state = {
      status: true,
    };

    this.flip = this.flip.bind(this);
  }

  componentDidMount() {
    this.timer = window.setInterval(this.flip, 1000);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  flip() {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const newStatus = !this.state.status;
    this.setState({ status: newStatus });
  }

  render() {
    const { time, ...otherProps } = this.props;
    const value = formatTime(time);
    return (
      <Typography {...otherProps}>{value}</Typography>
    );
  }
}

export default withStyles(useStyles)(Index);
