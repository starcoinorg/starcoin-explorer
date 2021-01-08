import React from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import StyledTableCell from '@/common/Table/StyledTableCell';
import TableBody from '@material-ui/core/TableBody';
import StyledTableRow from '@/common/Table/StyledTableRow';
import BaseRouteLink from '@/common/BaseRouteLink';
import formatTime from '@/utils/formatTime';

const useStyles = () => createStyles({
  table: {
    minWidth: 700,
  },
});

interface ExternalProps {
  blocks: any,
  sizeVisibleAt: string,
  validatorVisibleAt: string,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps {}

class Index extends React.PureComponent<Props> {
  render() {
    const { blocks, classes } = this.props;
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Height</StyledTableCell>
              <StyledTableCell align="right">Time</StyledTableCell>
              <StyledTableCell align="right">Transactions</StyledTableCell>
              <StyledTableCell align="right">Author</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              blocks.slice(0, 10).sort((a: any, b: any) => b._source.header.number - a._source.header.number).map((row: any) => {
                const header = row._source.header;
                const blockUrl = `/blocks/detail/${header.block_hash}`;
                // TODO: author info need to be decoded from sdk 3
                const authorUrl = `/author/${header.author}`;
                return (
                  <StyledTableRow key={header.block_hash}>
                    <StyledTableCell component="th" scope="row">
                      <BaseRouteLink to={blockUrl}>{header.number}</BaseRouteLink>
                    </StyledTableCell>
                    <StyledTableCell align="right"><Typography>{formatTime(header.timestamp)}</Typography></StyledTableCell>
                    <StyledTableCell align="right">{row._source.body.Full.length}</StyledTableCell>
                    <StyledTableCell align="right">
                      <BaseRouteLink to={authorUrl}>{header.author}</BaseRouteLink>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withStyles(useStyles)(Index);
