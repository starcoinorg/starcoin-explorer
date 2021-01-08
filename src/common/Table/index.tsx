import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Column from './Column';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('sm')]: {
    root: {
      '& > div:last-child > div': {
        paddingRight: theme.spacing(1),
      },
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      '& > div:last-child > div': {
        paddingRight: theme.spacing(2),
      },
    },
  },
  root: {
    display: 'flex',
  },
});

interface ColumnType {
  name: string,
  className?: string,
  values: Array<string | React.CElement<any, any>>,
  numeric?: boolean,
  visibleAt?: string,
  minWidth?: boolean,
}

interface ExternalProps {
  columns: Array<ColumnType>,
  getRowHeight?: (idx: number) => number | null,
  className?: string,
}

interface InternalProps {
 classes: any,
}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { columns, getRowHeight: getRowHeightIn, className, classes } = this.props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getRowHeight = getRowHeightIn || ((idx: number) => null);

    return (
      <div className={classNames(className, classes.root)}>
        {columns.map((col, idx) => (
          <Column
            key={col.name}
            className={col.className}
            name={col.name}
            values={col.values}
            numeric={col.numeric}
            visibleAt={col.visibleAt}
            firstCol={idx === 0}
            minWidth={col.minWidth}
            getRowHeight={getRowHeight}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
