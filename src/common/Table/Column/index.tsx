import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles } from '@mui/styles';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';

const useStyles = (theme: any) => createStyles({
  [theme.breakpoints.down('md')]: {
    pad: {
      paddingLeft: theme.spacing(1),
    },
    firstCol: {
      paddingLeft: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    pad: {
      paddingLeft: theme.spacing(3),
    },
    firstCol: {
      paddingLeft: theme.spacing(2),
    },
  },
  [theme.breakpoints.up('md')]: {
    pad: {
      paddingLeft: theme.spacing(5),
    },
  },
  root: {
    flex: '1 1 auto',
    flexDirection: 'column',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
  minWidth: {
    minWidth: '0',
  },
  alwaysVisible: {
    display: 'flex',
  },
  baseRow: {
    display: 'flex',
    alignItems: 'center',
    borderBottom:  theme.palette.mode === 'dark' ?  '1px solid rgba(256, 256, 256, 0.075)' :  '1px solid rgba(0, 0, 0, 0.075)',
    minHeight: 48,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  row: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.text.primary,
  },
  header: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.secondary,
  },
  textRowBase: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  oddRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.075)',
  },
  numeric: {
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  pad: {},
  firstCol: {},
});

interface ExternalProps {
  name: string,
  values: Array<string | React.CElement<any, any>>,
  numeric?: boolean,
  minWidth?: boolean,
  visibleAt?: string,
  firstCol: boolean,
  getRowHeight?: (idx: number) => number | null,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {
}

class Index extends React.PureComponent<Props> {
  render() {
    const {
      name,
      values,
      numeric,
      minWidth,
      visibleAt,
      firstCol,
      getRowHeight: getRowHeightIn,
      className,
      classes,
    } = this.props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getRowHeight = getRowHeightIn || ((idx: number) => null);
    const wrapValue = (value: any) => (
      (typeof value === 'string') ? (
        <Typography
          className={classNames(classes.textRowBase, classes.row)}
          variant='body1'
        >
          {value}
        </Typography>
      ) : (
        value
      )
    );
    const cells = values.map((value, idx) => {
      let style;
      const rowHeight = getRowHeight(idx);
      if (rowHeight != null) {
        style = { height: rowHeight };
      }
      return (
        <div
          key={idx}
          className={classNames({
            [classes.pad]: !firstCol,
            [classes.firstCol]: firstCol,
            [classes.baseRow]: true,
            [classes.row]: true,
            [classes.oddRow]: idx % 2 === 1,
            [classes.numeric]: !!numeric,
          })}
          style={style}
        >
          {wrapValue(value)}
        </div>
      );
    });
    const element = (
      <div
        className={classNames(
          {
            [classes.root]: true,
            [classes.alwaysVisible]: true,
            [classes.minWidth]: !minWidth,
          },
          className,
        )}
      >
        <div
          className={classNames({
            [classes.pad]: !firstCol,
            [classes.firstCol]: firstCol,
            [classes.baseRow]: true,
            [classes.numeric]: !!numeric,
          })}
        >
          <Typography
            className={classNames(classes.textRowBase, classes.header)}
            variant='body1'
          >
            {name}
          </Typography>
        </div>
        {cells}
      </div>
    );

    return (
      <Hidden
        smDown={visibleAt === 'xs'}
        mdDown={visibleAt === 'sm'}
        lgDown={visibleAt === 'md'}
        xlDown={visibleAt === 'lg'}
        implementation='js'
      >
        {element}
      </Hidden>
    );
  }
}

export default withStyles(useStyles)(Index);
