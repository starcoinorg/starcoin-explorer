import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Link from '@/common/Link';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('sm')]: {
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
    leftHeader: {
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    rightHeader: {
      marginBottom: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(2),
    },
    leftHeader: {
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    rightHeader: {
      marginBottom: theme.spacing(1),
    },
  },
  [theme.breakpoints.down('md')]: {
    root: {
      flexWrap: 'wrap',
    },
  },
  [theme.breakpoints.up('md')]: {
    root: {
      flexWrap: 'nowrap',
    },
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftHeader: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 1 auto',
    minWidth: '0',
  },
  rightHeader: {
    alignItems: 'center',
    display: 'flex',
  },
  static: {
    overflow: 'initial',
  },
  margin: {
    marginRight: theme.spacing(1),
  },
  text: {
    color: '#fff',
  },
  title: {
    fontSize: '1.3125rem',
    fontWeight: 700,
  },
  link: {
    color: '#fff',
    textDecoration: 'underline',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.87)',
    },
  },
  linkSelected: {
    color: 'rgba(255, 255, 255, 0.87)',
    textDecoration: 'underline',
  },
  backgroundColor: {
    backgroundColor: '#3d454d',
  },
  id: {
    flex: '0 1 auto',
    minWidth: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

interface ExternalProps {
  id: string,
  title: string,
  name: string,
  pluralName?: string,
  searchRoute?: string,
  icon?: string,
  backgroundColorClassName?: string,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { id, title, name, pluralName, searchRoute, icon, backgroundColorClassName, className, classes } = this.props;
    const breadcrumbVariant = 'body1';
    const slash = (
      <Typography
        className={classNames(classes.text, classes.margin, classes.static)}
        variant={breadcrumbVariant}
      >
        /
      </Typography>
    );
    const iconElement = (icon != null) ? <Icon className={classNames(classes.margin, classes.text)}>{icon}</Icon> : null;
    return (
      <div
        className={classNames(
          classes.root,
          className,
          backgroundColorClassName == null
            ? classes.backgroundColor
            : backgroundColorClassName,
        )}
      >
        <div className={classes.leftHeader}>
          {iconElement}
          <Typography
            className={classNames(classes.margin, classes.text, classes.title)}
            component="h1"
          >
            {title}
          </Typography>
          <Typography
            className={classNames(classes.text, classes.id)}
            variant="body2"
          >
            {id}
          </Typography>
        </div>
        <div className={classes.rightHeader}>
          <Link
            className={classNames(classes.link, classes.margin, classes.static)}
            variant={breadcrumbVariant}
            path="/"
            title="Home"
          />
          {slash}
          {
            (pluralName && searchRoute) ? (
              <>
                <Link
                  className={classNames(classes.link, classes.margin, classes.static)}
                  variant={breadcrumbVariant}
                  path={searchRoute}
                  title={pluralName}
                />
                {slash}
              </>
            ) : null
          }
          <Typography
            className={classNames(classes.linkSelected, classes.static)}
            variant={breadcrumbVariant}
          >
            {name}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
