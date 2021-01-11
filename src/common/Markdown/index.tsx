import React from 'react';
import classNames from 'classnames';
// @ts-ignore
import { MarkdownIt } from 'markdown-it';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => {
  return {
    root: {
      ...theme.typography.body1,
      overflowWrap: 'break-word',
      '& p': {
        marginBottom: 8,
        marginTop: 8,
      },
      '& a': {
        color: theme.palette.secondary.main,
      },
      '& hr': {
        border: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
        marginBottom: 8,
        marginTop: 8,
      },
      '& strong': {
        fontWeight: theme.typography.fontWeightMedium,
      },
      '& blockquote': {
        borderLeft: `5px solid ${theme.palette.divider}`,
        marginBottom: 16,
        marginLeft: 0,
        marginRight: 24,
        marginTop: 16,
        paddingLeft: 16,
      },
      '& ul': {
        marginBottom: 8,
        marginTop: 8,
        paddingLeft: 24,
      },
      '& ol': {
        marginBottom: 8,
        marginTop: 8,
        paddingLeft: 24,
      },
      '& pre': {
        marginBottom: 16,
        marginTop: 16,
        whiteSpace: 'pre-wrap',
      },
    },
  };
};

const useStyles = createStyles(styles);

export const mdOptions = {
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: true,
  typographer: true,
};

const defaultMD = require('markdown-it')(mdOptions);

interface ExternalProps {
  source: string,
  'data-test'?: string,
  md?: MarkdownIt,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { source, md: externalMD, 'data-test': dataTest, className, classes } = this.props;
    const md = externalMD || defaultMD;

    return (
      <div
        data-test={dataTest}
        className={classNames(classes.root, className)}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: md.render(source) }}
      />
    );
  }
}

export default withStyles(useStyles)(Index);
