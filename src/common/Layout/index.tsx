import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { withStyles, createStyles } from '@mui/styles';
import classNames from 'classnames';
import Loading from '@/common/Loading';
import Header from './Header/index';
import Footer from './Footer/index';

const useStyles = (theme: any) => {
  return createStyles({
    '@global': {
      body: {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : "#EAEAEA",
        margin: 0,
      },
      ".MuiInput-root:before": {
        borderBottomColor: theme.palette.getContrastText(theme.palette.background.paper),
      },
      ".MuiLink-root":{
        color: theme.palette.mode === 'dark' ? "#54A8F8" : "#3f51b5",
        textDecoration: 'none',
        '&:hover': {
          color: theme.palette.primary.dark,
          textDecoration: 'underline',
        },
      },
      ".MuiInput-input":{
        color: theme.palette.getContrastText(theme.palette.background.paper),
      },
      ".MuiTab-root":{
        color: theme.palette.getContrastText(theme.palette.background.paper),
      },
      ".MuiSvgIcon-root":{
        color: theme.palette.getContrastText(theme.palette.background.paper),
      },
      ".MuiInputLabel-root":{
        color:  theme.palette.mode === 'dark' ? theme.palette.grey[500] : undefined ,
      },
      ".MuiAccordion-root":{
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
        color: theme.palette.getContrastText(theme.palette.background.paper),
      },
      a:{
        color: theme.palette.mode === 'dark' ? "#54A8F8!important" : "#3f51b5!important",
      }
    },
    [theme.breakpoints.down('md')]: {
      contentInner: {
        padding: theme.spacing(1),
      },
    },
    [theme.breakpoints.up('sm')]: {
      contentInner: {
        padding: theme.spacing(2),
      },
    },
    root: {
      height: '100%',

    },
    header: {
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1100,
      position: 'fixed',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',

    },
    contentNormal: {
      top: theme.spacing(8),
      minHeight: `calc(100vh - ${theme.spacing(8)})`,
    },
    contentWarning: {
      top: theme.spacing(8),
      minHeight: `calc(100vh - ${theme.spacing(8)})`,
    },
    contentInner: {
      flex: '1 1 auto',
    },
  });
};

export interface IndexProps {
  classes: any;
  children?: React.ReactNode;
}

class Index extends React.PureComponent<IndexProps> {
  render() {
    const { children, classes } = this.props;
    return (
      <div className={classes.root}>
        <Helmet titleTemplate='%s - Starcoin' title='Starcoin'>
          <html lang='en' />
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/manifest.json' />
          <link
            rel='mask-icon'
            href='/safari-pinned-tab.svg'
          />
        </Helmet>
        <div className={classes.header}>
          <Header />
        </div>
        <div
          className={classNames({
            [classes.content]: true,
            [classes.contentNormal]: window.location.hostname === 'stcscan.io',
            [classes.contentWarning]: window.location.hostname !== 'stcscan.io',
          })}
        >
          <div className={classes.contentInner}>{children}</div>
          <Suspense fallback={<Loading />}>
            <Footer />
          </Suspense>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
