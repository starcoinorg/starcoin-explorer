import { createStyles, withStyles } from '@mui/styles';
import TableCell from '@mui/material/TableCell';

const StyledTableCell = withStyles((theme: any) => createStyles({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export default StyledTableCell;
