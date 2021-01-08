import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import BaseRouteLink from '@/common/BaseRouteLink';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tabs from './Tabs';

const useStyles = makeStyles((theme: any) => ({
  header: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.getContrastText(theme.palette.background.paper),
    display: 'flex',
    flexDirection: 'column',
  },
  headerNormal: {
    height: theme.spacing(8),
  },
  headerWallet: {
    height: theme.spacing(14),
  },
  mainHeader: {
    alignItems: 'center',
    display: 'flex',
    height: theme.spacing(8),
    flex: '0 0 auto',
    flexDirection: 'row',
  },
  mainHeaderWallet: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
  },
  tabs: {
    alignItems: 'flex-end',
    display: 'flex',
    height: '100%',
  },
  title: {
    marginRight: theme.spacing(2),
  },
  pad: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  button: {
    height: theme.spacing(6),
    border: 'none',
  },
  search: {
    alignItems: 'center',
    borderTop: '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
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
}));

export default function HeaderUpMD() {
  const location = window.location;
  const classes = useStyles();
  const tabs = (
    <Tabs
      tabs={[
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
      ]}
    />
  );
  return (
    <div
      className={classNames({
        [classes.header]: true,
        [classes.headerNormal]: true,
      })}
    >
      <div
        className={classNames({
          [classes.mainHeader]: true,
          [classes.pad]: true,
        })}
      >
        <div className={classes.tabs}>
          <BaseRouteLink to="/" underline="none">
            <Button>
              <Typography className={classes.logo} variant="h3">
                Starcoin
              </Typography>
            </Button>
          </BaseRouteLink>
          {tabs}
        </div>
      </div>
    </div>
  );
}
