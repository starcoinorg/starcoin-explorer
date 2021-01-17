import React from 'react';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import CommonLink from '@/common/Link';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('sm')]: {
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
    leftHeader: {
      marginBottom: theme.spacing(1),
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
      marginBottom: theme.spacing(2),
    },
    rightHeader: {
      marginBottom: theme.spacing(2),
    },
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  leftHeader: {
    alignItems: 'center',
    display: 'flex',
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
});

interface ExternalProps {
  id?: string,
  title?: string,
  name: string,
  pluralName: string,
  searchRoute?: string,
  icon?: string,
  backgroundColorClassName?: string,
  className?: string,
}

interface InternalProps {
  classes: any,
  t: any,
}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { id, title, name, pluralName, searchRoute, icon, backgroundColorClassName, t, className, classes } = this.props;
    const breadcrumbVariant = 'body1';
    const slash = (
      <Typography
        className={classNames(classes.text, classes.margin, classes.static)}
        variant={breadcrumbVariant}
      >
        /
      </Typography>
    );
    let iconElement = null;
    if (icon != null) {
      iconElement = (
        <Icon className={classNames(classes.margin, classes.text)}>{icon}</Icon>
      );
    }

    let idElement = null;
    let infoElement = null;
    let searchElement = (
      <Typography
        className={classNames(classes.linkSelected, classes.static)}
        variant={breadcrumbVariant}
      >
        {pluralName}
      </Typography>
    );
    if (id != null && searchRoute != null) {
      idElement = (
        <Typography className={classes.text} variant="body2">
          {id}
        </Typography>
      );
      searchElement = (
        <CommonLink
          className={classNames(classes.link, classes.margin, classes.static)}
          variant={breadcrumbVariant}
          path={searchRoute}
          title={pluralName}
        />
      );
      infoElement = (
        <Typography
          className={classNames(classes.linkSelected, classes.static)}
          variant={breadcrumbVariant}
        >
          {name} Information
        </Typography>
      );
    }
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
            className={classNames(classes.margin, classes.text)}
            component="h4"
          >
            {title == null ? pluralName : title}
          </Typography>
          {idElement}
        </div>
        <div className={classes.rightHeader}>
          <CommonLink
            className={classNames(classes.link, classes.margin, classes.static)}
            variant={breadcrumbVariant}
            path="/"
            title={t('header.home')}
          />
          {slash}
          {searchElement}
          {infoElement == null ? null : slash}
          {infoElement}
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
