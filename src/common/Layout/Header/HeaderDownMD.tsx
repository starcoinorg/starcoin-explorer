import React, { PureComponent } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import classNames from 'classnames';
import BaseRouteLink from '@/common/BaseRouteLink';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('sm')]: {
    pad: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    title: {
      marginRight: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    pad: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    title: {
      marginRight: theme.spacing(2),
    },
  },
  root: {
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'row',
    height: theme.spacing(8),
    justifyContent: 'space-between',

  },
  title: {},
  pad: {},
  selected: {
    color: theme.palette.primary.main,
  },
  menuButton: {
    height: theme.spacing(6),
  },
  menu: {
    display: 'flex',
    borderTop: '1px solid rgba(0, 0, 0, 0.075)',
    flexDirection: 'column',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  link: {
    textDecoration: 'none',
  },
  button: {
    width: '100%',
  },
  logo: {
    fontFamily: 'Bauhaus93',
    fontSize: `${theme.spacing(6)}px`,
    color: '#3d454d',
    letterSpacing: `-${theme.spacing(2 / 4)}px`,
    textAlign: 'left',
    marginRight: theme.spacing(2),
    lineHeight: 1,
    textTransform: 'none'
  },
});

interface IndexProps {
  classes: any;
}

interface IndexState {
  showMenu: boolean
}

class Index extends PureComponent<IndexProps, IndexState> {
  constructor(props: IndexProps) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  onClickButton = () => {
    if (this.state.showMenu) {
      this.setState({ showMenu: false });
    }
  };

  onHideMenu = (event: any) => {
    if (this.state.showMenu) {
      event.preventDefault();
      this.setState({ showMenu: false });
    }
  };

  onShowMenu = (event: any) => {
    event.preventDefault();
    if (!this.state.showMenu) {
      this.setState({ showMenu: true });
    }
  };

  onClickMenu = (event: any) => {
    event.preventDefault();
    if (this.state.showMenu) {
      this.onHideMenu(event);
    } else {
      this.onShowMenu(event);
    }
  };

  onClickAway = (event: any) => {
    if (this.state.showMenu) {
      event.preventDefault();
      this.setState({ showMenu: false });
    } else {
      this.setState({ showMenu: true });
    }
  };

  render() {
    const { classes } = this.props;
    const location = window.location;
    const buttons = [
      {
        className: classes.button,
        id: 'blocks',
        label: 'Blocks',
        selected: location.pathname.startsWith('/blocks'),
        href: '/blocks',
      },
      {
        className: classes.button,
        id: 'transactions',
        label: 'Transactions',
        selected: location.pathname.startsWith('/transactions'),
        href: '/transactions',
      },
      {
        className: classes.button,
        id: 'ecosystem',
        label: 'Ecosystem',
        selected: location.pathname.startsWith('/ecosystem'),
        href: '/ecosystems',
      },
      {
        className: classes.button,
        id: 'faq',
        label: 'FAQ',
        selected: location.pathname.startsWith('/faq'),
        href: 'faq',
      },
    ];

    return (
      <div className={classes.root}>
        <div className={classNames(classes.header, classes.pad)}>
          <BaseRouteLink to="/" underline="none">
            <Button>
              <Typography className={classes.logo} variant="h3">
                Starcoin
              </Typography>
            </Button>
          </BaseRouteLink>
          <IconButton
            className={classes.menuButton}
            onMouseUp={this.onClickMenu}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <Collapse in={this.state.showMenu} timeout="auto">
          <ClickAwayListener onClickAway={this.onClickAway}>
            <div className={classNames(classes.menu, classes.pad)}>
              {buttons.map((button) => (
                <BaseRouteLink key={button.id} className={classes.link} to={button.href}>
                  <Button
                    color={button.selected ? 'primary' : 'default'}
                    className={button.className}
                    onClick={this.onClickButton}
                  >
                    <Typography variant="body1">{button.label}</Typography>
                  </Button>
                </BaseRouteLink>
              ))}
            </div>
          </ClickAwayListener>
        </Collapse>
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
