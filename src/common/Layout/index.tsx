import React, { FC, memo } from 'react';
import Helmet from 'react-helmet';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import classNames from 'classnames';
import Header from './Header/index';
import Footer from './Footer/index';

const styles = (theme: Theme) => createStyles({
  '@global': {
    body: {
      backgroundColor: theme.palette.grey[200],
      margin: 0,
    },
  },
  [theme.breakpoints.down('sm')]: {
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
    position: 'fixed'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  contentNormal: {
    top: theme.spacing(8),
    minHeight: `calc(100% - ${theme.spacing(8)}px)`,
  },
  contentInner: {
    flex: '1 1 auto',
  },
});

export interface LayoutProps {
  classes: any;
  children?: React.ReactNode;
}

const Layout: FC<LayoutProps> = (props) => {
  const { children, classes } = props;
  return (
    <div className={classes.root}>
      <Helmet titleTemplate="%s - StarCoin" title="StarCoin">
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
        />
      </Helmet>
      <div className={classes.header}>
        <Header />
      </div>
      <div
        className={classNames({
          [classes.content]: true,
          [classes.contentNormal]: true,
        })}
      >
        <div className={classes.contentInner}>{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default withStyles(styles)(memo(Layout));
