import React, { PureComponent } from 'react'
// import withLoading from '@/common/LoadingMasker/withLoading';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import formatTime from '@/utils/formatTime';
import BaseRouteLink from "@/common/BaseRouteLink";
import TableHead from '@material-ui/core/TableHead';

interface IndexProps {
  classes: any;
  match: any;
  transaction: any;
  getTransaction: (data: any, callback?: any) => any;
}


const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const useStyles = (theme: Theme) => ({
  table: {
    minWidth: 700,
  },
});

class Index extends PureComponent<IndexProps> {
  static defaultProps = {
    match: {},
    transaction: null,
    getTransaction: () => {}
  };

  componentDidMount() {
    const hash = this.props.match.params.hash;
    this.props.getTransaction({ hash })
  }

  render() {
    const hash = this.props.match.params.hash;
    const { classes } = this.props;
    const { transaction } = this.props;
    if (!transaction) {
      return null;
    }
    const source = transaction.hits.hits[0]._source;
    const columns = [
      ['Hash', source.transaction_hash],
      ['Block Hash', source.block_hash],
      ['Block Height', source.block_number],
      ['State Root Hash', source.state_root_hash],
      ['Status', source.status],
      ['Gas Used', source.gas_used],
    ];
    return (
      <React.Fragment>
        <div>
          <h3>{`Transaction ${hash}`}</h3>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableBody>
                {
                  columns.map((column: any, index: number) => {
                    return(
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {column[0]}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {column[1]}
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>Events</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>data</StyledTableCell>
                      <StyledTableCell>event_key</StyledTableCell>
                      <StyledTableCell>event_seq_number</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      source.events.map((row: any) => {
                        return(
                          <StyledTableRow key={row.data}>
                            <StyledTableCell component="th" scope="row">{row.data}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.event_key}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.event_seq_number}</StyledTableCell>

                          </StyledTableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(Index);