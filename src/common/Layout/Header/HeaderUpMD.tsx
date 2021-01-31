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
import LanguageIcon from '@material-ui/icons/Translate';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LANGUAGES_LABEL } from '@/utils/constants';
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

  const pathname = window.location.pathname;
  const tabs = (
    <Tabs
      tabs={[
        {
          className: classes.button,
          id: 'blocks',
          label: t('header.blocks'),
          selected: pathname.startsWith('/blocks'),
          href: '/blocks',
        },
        {
          className: classes.button,
          id: 'transactions',
          label: t('header.transactions'),
          selected: pathname.startsWith('/transactions'),
          href: '/transactions',
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
          href: 'faq',
        },
      ]}
    />
  );
  // set a default value before locales/*/transaction.json is loaded
  const current = LANGUAGES_LABEL.filter((language) => language.code === userLanguage);
  const currentLabel = current[0] && current[0].text || '-';
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
        </div>
      </div>
    </div>
  );
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Index);
