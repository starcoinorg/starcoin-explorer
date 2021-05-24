import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import BaseRouteLink from '@/common/BaseRouteLink';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import LanguageIcon from '@material-ui/icons/Translate';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LANGUAGES_LABEL } from '@/utils/constants';
import { getNetwork } from '@/utils/helper';
import Tabs from './Tabs';

const useStyles = (theme: Theme) => createStyles({
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
  noUpperCase: {
    textTransform: 'none'
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
  logoLink: {
    display: 'grid',
    gridGap: '10px',
    gridAutoFlow: 'column',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logo: {
    fontFamily: 'Bauhaus93',
    fontSize: `${theme.spacing(6)}px`,
    color: '#3d454d',
    letterSpacing: `-${theme.spacing(2 / 4)}px`,
    textAlign: 'left',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    lineHeight: 1,
    textTransform: 'none'
  },
  i18n: {
    height: theme.spacing(6),
  },
  language: {
    margin: theme.spacing(0, 0.5, 0, 1),
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
});

function Index(props: any) {
  const { classes } = props;
  const { t, i18n }: { t: any, i18n: any } = useTranslation();
  const userLanguage = i18n.language || 'en';
  const [languageMenu, setLanguageMenu] = React.useState(null);
  const handleLanguageIconClick = (event: any) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageMenuClose = (lang?: string) => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
    setLanguageMenu(null);
  };

  // set a default value before locales/*/transaction.json is loaded
  const current = LANGUAGES_LABEL.filter((language) => language.code === userLanguage);
  const currentLabel = current[0] && current[0].text || '-';
  const i18nMenu = (
    <>
      <Tooltip title={t('header.changeLanguage')} enterDelay={300}>
        <Button
          className={classes.i18n}
          color="inherit"
          aria-owns={languageMenu ? 'language-menu' : undefined}
          aria-haspopup="true"
          onClick={handleLanguageIconClick}
        >
          <LanguageIcon />
          <span className={classes.language}>
            {currentLabel}
          </span>
          <ExpandMoreIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Menu
        id="language-menu"
        anchorEl={languageMenu}
        open={Boolean(languageMenu)}
        onClose={() => handleLanguageMenuClose()}
      >
        {LANGUAGES_LABEL.map((language) => (
          <MenuItem
            key={language.code}
            selected={userLanguage === language.code}
            onClick={() => handleLanguageMenuClose(language.code)}
          >
            {language.text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  const userNetwork = getNetwork();
  const [networkMenu, setNetworkMenu] = React.useState(null);
  const handleNetworkIconClick = (event: any) => {
    setNetworkMenu(event.currentTarget);
  };

  const handleNetworkMenuClose = (network?: string) => {
    if (network) {
      localStorage.setItem('network', network);
      window.location.href = '/';
    }
    setNetworkMenu(null);
  };

  const networks = process.env.REACT_APP_STARCOIN_NETWORKS || '';
  const availableNetworks = networks.split(',');
  const currentNetwork = availableNetworks.filter((network) => network === userNetwork);
  const currentNetworkLabel = currentNetwork[0] || '-';
  const networkMenus = (
    <>
      <Tooltip title={t('header.changeNetwork')} enterDelay={300}>
        <Button
          className={classNames(classes.i18n, classes.noUpperCase)}
          color="inherit"
          aria-owns={networkMenu ? 'network-menu' : undefined}
          aria-haspopup="true"
          onClick={handleNetworkIconClick}
        >
          <SettingsEthernetIcon fontSize="small" />&nbsp;
          <span className={classes.language}>
            {currentNetworkLabel}
          </span>
          <ExpandMoreIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Menu
        id="network-menu"
        anchorEl={networkMenu}
        open={Boolean(networkMenu)}
        onClose={() => handleNetworkMenuClose()}
      >
        {availableNetworks.map((network) => (
          <MenuItem
            className={classes.noUpperCase}
            key={network}
            selected={userNetwork === network}
            onClick={() => handleNetworkMenuClose(network)}
          >
            {network}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  const pathname = window.location.pathname;
  const tabs = (
    <Tabs
      tabs={[
        {
          className: classes.button,
          id: 'blocks',
          label: t('header.blocks'),
          selected: pathname.startsWith('/blocks'),
          href: `/${userNetwork}/blocks/1`,
        },
        {
          className: classes.button,
          id: 'transactions',
          label: t('header.transactions'),
          selected: pathname.startsWith('/transactions'),
          href: `/${userNetwork}/transactions`,
        },
        {
          className: classes.button,
          id: 'ecosystems',
          label: t('header.ecosystems'),
          selected: pathname.startsWith('/ecosystems'),
          href: '/ecosystems',
        },
        {
          className: classes.button,
          id: 'faq',
          label: t('header.faq'),
          selected: pathname.startsWith('/faq'),
          href: '/faq',
        },
        {
          className: classes.button,
          id: 'terms',
          label: t('header.terms'),
          selected: pathname.startsWith('/terms'),
          href: '/terms',
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
            <div className={classes.logoLink}>
              <Typography className={classes.logo} variant="h3">
                Starcoin
              </Typography>
            </div>
          </BaseRouteLink>
          {tabs}
          {networkMenus}
          {i18nMenu}
        </div>
      </div>
    </div>
  );
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Index);
