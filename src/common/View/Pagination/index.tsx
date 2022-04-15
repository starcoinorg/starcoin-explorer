import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import formatNumber from '@/utils/formatNumber';

const useStyles = (theme: any) => createStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
  count: {
    paddingRight: theme.spacing(2),
  },
  error: {
    color: theme.palette.secondary.main,
  },
  margin: {
    marginRight: theme.spacing(2),
  },
});

interface ExternalProps {
  page: number,
  pageSize: number,
  currentPageSize: number | null,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
  onPrevPage: () => void,
  onNextPage: () => void,
  isLoading?: boolean,
  error?: string | null,
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
      page,
      pageSize,
      currentPageSize,
      hasPreviousPage,
      hasNextPage,
      onPrevPage,
      onNextPage,
      isLoading,
      error,
      className,
      classes,
    } = this.props;
    let start = 1;
    let end = 1;
    let totalElement = <span className={classes.count}>0 - 0</span>;
    if (currentPageSize != null) {
      start = (page - 1) * pageSize + 1;
      end = start + currentPageSize - 1;
      if (end === 0) {
        start = 0;
      }
      totalElement = (
        <span className={classes.count}>
          {`${formatNumber(start)} - ${formatNumber(end)}`}
        </span>
      );
    }
    return (
      <div className={classNames(classes.root, className)}>
        {error != null ? (
          <Typography
            className={classNames(classes.margin, classes.error)}
            variant='body1'
          >
            {error}
          </Typography>
        ) : null}
        {isLoading ? (
          <CircularProgress size={32} thickness={5} className={classes.margin} />
        ) : null}
        {totalElement}
        <IconButton
          color='inherit'
          disabled={isLoading || !hasPreviousPage}
          onClick={onPrevPage}
          size='large'>
          <ArrowBackIos />
        </IconButton>
        <IconButton color='inherit' disabled={isLoading || !hasNextPage} onClick={onNextPage} size='large'>
          <ArrowForwardIos />
        </IconButton>
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
