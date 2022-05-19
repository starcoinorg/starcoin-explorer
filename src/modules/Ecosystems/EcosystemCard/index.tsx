import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { createStyles, withStyles } from '@mui/styles';

const useStyles = (theme: any) => createStyles({
  root: {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
  text: {
    padding: theme.spacing(2) ,
    height: theme.spacing(14) ,
    overflowY: 'scroll',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none',
    scrollbarWidth: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    cardCommon: {
      transition: '.4s ease box-shadow',
      borderRadius: '4px',
    },
  },
  [theme.breakpoints.up('sm')]: {
    cardCommon: {
      transition: '.4s ease box-shadow',
      borderRadius: '4px',
    },
  },
  [theme.breakpoints.up('lg')]: {
    cardCommon: {
      transition: '.4s ease box-shadow',
      borderRadius: '4px',
    },
  },
  cardHover: {
    boxShadow: `
    calc(${theme.spacing(0)} -${theme.spacing(1) } -${theme.spacing(3) } - ${theme.spacing(0)} ) rgba(0,0,0,0.2),
    calc(${theme.spacing(0)} -${theme.spacing(1)}- ${theme.spacing(1)} - ${theme.spacing(0)} ) rgba(0,0,0,0.14),
    calc(${theme.spacing(0)} -${theme.spacing(2) } -${theme.spacing(1)} - ${theme.spacing(1)}) rgba(0,0,0,0.12)
    `,
    cursor: 'pointer',
  },
  cardNoHover: {},
  media: {
    height: 140,
  },
  mediaCover: {
    objectFit: 'cover',
  },
  mediaContain: {
    objectFit: 'contain',
  },
  [theme.breakpoints.down('md')]: {
    header: {
      padding: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    header: {
      padding: theme.spacing(2),
    },
  },
  header: {
    alignItems: 'center',
    borderBottom: theme.palette.mode === 'dark' ?  '1px solid rgba(256, 256, 256, 0.075)' : '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
    backgroundColor: theme.palette.mode === "dark"? theme.palette.background.default : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),

  },
  card:{
    display: 'flex',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
    flexDirection: 'column',
  },
  title: {
    fontWeight: 700,
  },
});

interface ExternalProps {
  key?: string,
  title: string,
  description: string,
  link: string,
  image: string,
  cover: boolean,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {
}

interface IndexState {
  displayHover: boolean;
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    key: undefined,
    title: undefined,
    description: undefined,
    link: undefined,
    image: undefined,
    cover: undefined,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      displayHover: false,
    };
  }

  onCardEnter = () => {
    this.setState({ displayHover: true });
  };

  onCardLeave = () => {
    this.setState({ displayHover: false });
  };

  render() {
    const { title, description, link, image, cover, classes } = this.props;
    const openLink = () => {
      window.open(link, '_blank');
    };
    return (
      <div
        className={classNames(
          classes.cardCommon,
          this.state.displayHover ? classes.cardHover : classes.cardNoHover,
        )}
        onClick={openLink}
        onMouseEnter={this.onCardEnter}
        onMouseLeave={this.onCardLeave}
      >
        <Card className={classes.card}>
          <div className={classes.header}>
            <Typography variant='h5' gutterBottom className={classes.title}>
              {title}
            </Typography>
          </div>
          <CardMedia
            component='img'
            className={classNames(
              classes.media,
              cover ? classes.mediaCover : classes.mediaContain,
            )}
            src={`${process.env.PUBLIC_URL}/${image}`}
            title={title}
          />
          <Typography className={classes.text} variant='body2'>
            {description}
          </Typography>
        </Card>
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
