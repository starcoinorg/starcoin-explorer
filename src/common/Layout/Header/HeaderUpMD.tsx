import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { createStyles, withStyles, useTheme } from '@mui/styles';
import classNames from 'classnames';
import BaseRouteLink from '@/common/BaseRouteLink';
import { IconButton } from '@mui/material';
import { Brightness4Sharp, Brightness7Sharp } from '@mui/icons-material';
import { ColorModeContext } from '@/utils/context';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Tooltip from '@mui/material/Tooltip';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import LanguageIcon from '@mui/icons-material/Translate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LANGUAGES_LABEL } from '@/utils/constants';
import { getNetwork } from '@/utils/helper';
import Tabs from './Tabs';
import StarcoinLogo from '../../../starcoin.jpeg';


const useStyles = (theme: any) => createStyles({
  header: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.paper),
    display: 'flex',
    flexDirection: 'column',
  },
  warning: {
    color: '#721c24',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    textAlign: 'center',
    height: '64px',
    lineHeight: '64px',
    fontSize: '24px',
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
    // height: '100%',
  },
  title: {
    marginRight: theme.spacing(2),
  },
  pad: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  noUpperCase: {
    textTransform: 'none',
  },
  button: {
    height: theme.spacing(6),
    border: 'none',
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
  search: {
    alignItems: 'center',
    borderTop: '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  logoLink: {
    // display: 'grid',
    gridGap: '10px',
    gridAutoFlow: 'column',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logoImg: {
    width: '132px',
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
    textTransform: 'none',
  },
  i18n: {
    height: theme.spacing(6),

  },
  blockMenu: {
    fontSize: '1rem',

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
  const theme = useTheme() as any;
  const colorMode = React.useContext(ColorModeContext);
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
          color='inherit'
          aria-owns={languageMenu ? 'language-menu' : undefined}
          aria-haspopup='true'
          onClick={handleLanguageIconClick}
        >
          <LanguageIcon />
          <span className={classes.language}>
            {currentLabel}
          </span>
          <ExpandMoreIcon fontSize='small' />
        </Button>
      </Tooltip>
      <Menu

        id='language-menu'
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


      <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color='inherit'>
        {theme.palette.mode === 'dark' ? <Brightness7Sharp /> : <Brightness4Sharp />}
      </IconButton>
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
  const availableNetworks = networks.split(',').filter(item => item !== 'proxima');
  const currentNetwork = availableNetworks.filter((network) => network === userNetwork);
  const currentNetworkLabel = currentNetwork[0] || '-';
  const networkMenus = (
    <>
      <Tooltip title={t('header.changeNetwork')} enterDelay={300}>
        <Button
          className={classNames(classes.i18n, classes.noUpperCase)}
          color='inherit'
          aria-owns={networkMenu ? 'network-menu' : undefined}
          aria-haspopup='true'
          onClick={handleNetworkIconClick}
        >
          <SettingsEthernetIcon fontSize='small' />&nbsp;
          <span className={classes.language}>
            {currentNetworkLabel}
          </span>
          <ExpandMoreIcon fontSize='small' />
        </Button>
      </Tooltip>
      <Menu
        id='network-menu'
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

  // block menu: blocks, uncle blocks
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleBlockMenuIconClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleBlockMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBlockClose = () => {
    window.location.href = `/${userNetwork}/blocks/1`;
    setAnchorEl(null);
  };

  const handleUncleBlockClose = () => {
    window.location.href = `/${userNetwork}/uncleblocks/1`;
    setAnchorEl(null);
  };

  const blockMenu = (
    <>
      <Tooltip title={t('header.chooseBlocks')} disableFocusListener enterDelay={300}>
        <Button
          className={classes.button}
          color='inherit'
          aria-owns={undefined}
          aria-haspopup='true'
          aria-controls='fade-menu'
          onClick={handleBlockMenuIconClick}
        >
          <span className={classes.blockMenu}>
            {t('header.blocks')}
          </span>
          <ExpandMoreIcon fontSize='small' />
        </Button>
      </Tooltip>
      <Menu
        id='fade-menu'
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleBlockMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleBlockClose}>{t('header.blocks')}</MenuItem>
        <MenuItem onClick={handleUncleBlockClose}>{t('header.uncleblocks')}</MenuItem>
      </Menu>
    </>
  );

  // transaction menu: transactions, pending transactions
  const [anchorTxn, setAnchorTxn] = React.useState(null);
  const openTxn = Boolean(anchorTxn);

  const handleTxnMenuIconClick = (event: any) => {
    setAnchorTxn(event.currentTarget);
  };

  const handleTxnMenuClose = () => {
    setAnchorTxn(null);
  };

  const handleTxnClose = () => {
    window.location.href = `/${userNetwork}/transactions/1`;
    setAnchorTxn(null);
  };

  const handlePendingTxnClose = () => {
    window.location.href = `/${userNetwork}/pending_transactions/1`;
    setAnchorTxn(null);
  };

  const txnMenu = (
    <>
      <Tooltip   title={t('header.chooseTxn')} disableFocusListener enterDelay={300}>
        <Button
          className={classes.button}
          color='inherit'
          aria-owns={undefined}
          aria-haspopup='true'
          aria-controls='fade-menu'
          onClick={handleTxnMenuIconClick}
        >
          <span className={classes.blockMenu}>
            {t('header.transactions')}
          </span>
          <ExpandMoreIcon fontSize='small' />
        </Button>
      </Tooltip>
      <Menu
        id='fade-menu'
        anchorEl={anchorTxn}
        keepMounted
        open={openTxn}
        onClose={handleTxnMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleTxnClose}>{t('header.transactions')}</MenuItem>
        <MenuItem onClick={handlePendingTxnClose}>{t('header.pendingTransactions')}</MenuItem>
      </Menu>
    </>
  );

  // about menu: ecosystem, faq, terms
  const [anchorAbout, setAnchorAbout] = React.useState(null);
  const openAbout = Boolean(anchorAbout);

  const handleAboutMenuIconClick = (event: any) => {
    setAnchorAbout(event.currentTarget);
  };

  const handleAboutMenuClose = () => {
    setAnchorAbout(null);
  };

  const handleAboutEcosystemClose = () => {
    window.location.href = `/ecosystems`;
    setAnchorAbout(null);
  };

  const handleAboutFAQClose = () => {
    window.location.href = `/faq`;
    setAnchorAbout(null);
  };

  const handleAboutTermsClose = () => {
    window.location.href = `/terms`;
    setAnchorAbout(null);
  };

  const aboutMenu = (
    <>
      <Tooltip title={t('header.chooseAbout')} disableFocusListener enterDelay={300}>
        <Button
          className={classes.button}
          color='inherit'
          aria-owns={undefined}
          aria-haspopup='true'
          aria-controls='fade-menu'
          onClick={handleAboutMenuIconClick}
        >
          <span className={classes.blockMenu}>
            {t('header.about')}
          </span>
          <ExpandMoreIcon fontSize='small' />
        </Button>
      </Tooltip>
      <Menu
        id='fade-menu'
        anchorEl={anchorAbout}
        keepMounted
        open={openAbout}
        onClose={handleAboutMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleAboutEcosystemClose}>{t('header.ecosystems')}</MenuItem>
        <MenuItem onClick={handleAboutFAQClose}>{t('header.faq')}</MenuItem>
        <MenuItem onClick={handleAboutTermsClose}>{t('header.terms')}</MenuItem>
      </Menu>
    </>
  );

  const pathname = window.location.pathname;
  const tabs = (
    <Tabs
      tabs={[
        /*
        {
          className: classes.button,
          id: 'blocks',
          label: t('header.blocks'),
          selected: pathname.startsWith('/blocks'),
          href: `/${userNetwork}/blocks/1`,
        },
        {
          className: classes.button,
          id: 'uncleblocks',
          label: t('header.uncleblocks'),
          selected: window.location.pathname.startsWith('/uncleblocks'),
          href: `/${userNetwork}/uncleblocks/1`,
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
        */
        {
          className: classes.button,
          id: 'tokens',
          label: t('header.tokens'),
          selected: pathname.startsWith('/tokens'),
          href: `/${userNetwork}/tokens/1`,
        },
        {
          className: classes.button,
          id: 'tools',
          label: t('header.tools'),
          selected: pathname.startsWith('/tools'),
          href: '/tools',
        },
      ]}
    />
  );

  return (
    <>
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
            <BaseRouteLink to='/' underline='none'>
              <div className={classes.logoLink}>
                <img className={classes.logoImg} src={StarcoinLogo} alt='logo' />
                {/*
              <Typography className={classes.logo} variant="h3">
                { window.location.hostname === 'stcscan.io' ? 'StcScan' : 'Starcoin' }
              </Typography>
              */}
              </div>
            </BaseRouteLink>
            {blockMenu}
            {txnMenu}
            {tabs}
            {aboutMenu}
            {networkMenus}
            {i18nMenu}
          </div>
        </div>
      </div>
    </>
  );
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Index);
