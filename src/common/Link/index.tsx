import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles } from '@mui/styles';
import { Variant } from '@mui/material/styles/createTypography';
import Typography from '@mui/material/Typography';
import { Link as RRLink } from 'react-router-dom';

const useStyles = (theme: any) => createStyles({
  commonLink: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  link: {
    color: theme.palette.mode === 'dark' ? "#54A8F8" : "#3f51b5",
    fontWeight: theme.typography.fontWeightRegular,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline',
    },
  },
  linkWhite: {
    color: '#fff',
    fontWeight: theme.typography.fontWeightRegular,
    textDecoration: 'underline',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.87)',
      textDecoration: 'underline',
    },
  },
});

interface ExternalProps {
  path: string,
  title: string | React.CElement<any, any>,
  variant?: Variant,
  white?: boolean,
  absolute?: boolean,
  newTab?: boolean,
  onClick?: () => void,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {
}

class Index extends React.PureComponent<Props> {
  render() {
    const { path, title, variant: variantIn, white, absolute, newTab, onClick, className, classes } = this.props;
    const variant = variantIn || 'body1';
    const classNameLink = classNames(
      {
        [classes.link]: !white,
        [classes.linkWhite]: !!white,
      },
      classes.commonLink,
    );
    let linkText;
    if (typeof title === 'string') {
      linkText = (
        <Typography
          variant={variant}
          className={classNames(classNameLink, className)}
        >
          {title}
        </Typography>
      );
    } else {
      linkText = React.cloneElement(
        title,
        {
          ...title.props,
          className: classNames(classNameLink, className, title.props.className),
        },
        title.props.children,
      );
    }

    if (absolute || path.startsWith('http') || newTab) {
      return (
        // eslint-disable-next-line react/jsx-no-target-blank
        <a
          className={classNameLink}
          href={path}
          target={newTab ? '_blank' : undefined}
          onClick={onClick}
        >
          {linkText}
        </a>
      );
    }

    return (
      <RRLink className={classNameLink} to={path} onClick={onClick}>
        {linkText}
      </RRLink>
    );
  }
}

export default withStyles(useStyles)(Index);
