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
  constructor(props: Props) {
    super(props);

    this.state = {
      status: true,
    };

    this.flip = this.flip.bind(this);
  }

  componentDidMount() {
    setInterval(this.flip, 1000);
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
