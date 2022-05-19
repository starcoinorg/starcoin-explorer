import { createStyles, withStyles } from '@mui/styles';
import TableRow from '@mui/material/TableRow';

const StyledTableRow = withStyles((theme: any) => createStyles({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default StyledTableRow;
