import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const year = new Date().getFullYear();

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  root: {
    backgroundColor: '#3d454d',
    color: '#9babaf',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  secondRow: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '90%',
  },
  copyright: {
    // color: theme.custom.colors.common.white,
  },
  icon: {
    // fill: theme.custom.colors.common.white,
    paddingRight: theme.spacing(1 / 2),
  },
}));

export default function Footer() {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.root}>
      <div className={classes.secondRow}>
        <Typography className={classes.copyright} variant="caption">
          © 2018-{year} Starcoin.org {t('footer.content')}.
        </Typography>
      </div>
    </div>
  );
}
