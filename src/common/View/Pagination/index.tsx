import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import formatNumber from '@/utils/formatNumber';

const useStyles = (theme: Theme) => createStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
  },
  count: {
    paddingRight: theme.spacing(1) * 2,
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

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { page, pageSize, currentPageSize, hasPreviousPage, hasNextPage, onPrevPage, onNextPage, isLoading, error, className, classes } = this.props;
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
            variant="body1"
          >
            {error}
          </Typography>
        ) : null}
        {isLoading ? (
          <CircularProgress size={32} thickness={5} className={classes.margin} />
        ) : null}
        {totalElement}
        <IconButton
          disabled={isLoading || !hasPreviousPage}
          onClick={onPrevPage}
        >
          <ArrowBackIos />
        </IconButton>
        <IconButton
          disabled={isLoading || !hasNextPage}
          onClick={onNextPage}
        >
          <ArrowForwardIos />
        </IconButton>
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
