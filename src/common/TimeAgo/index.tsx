import React from 'react';
import { withTranslation } from 'react-i18next';
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
  i18n: any,
}

interface Props extends ExternalProps, InternalProps {}

interface IndexState {
  status: boolean,
}

class Index extends React.PureComponent<Props, IndexState> {
  private timer: number = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      status: true,
    };

    this.flip = this.flip.bind(this);
  }

  componentDidMount() {
    this.timer = window.setInterval(this.flip, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  flip() {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const newStatus = !this.state.status;
    this.setState({ status: newStatus });
  }

  render() {
    const { time, i18n, className, classes } = this.props;
    const value = formatTime(time, i18n.language);
    return (
      <Typography className={className} classes={classes}>{value}</Typography>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
