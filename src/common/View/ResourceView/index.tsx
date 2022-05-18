import React from 'react';
// import EventViewTable from '@/common/View/EventViewTable';
import { createStyles, withStyles } from '@mui/styles';
import ResourceViewTable from '@/common/View/ResourceViewTable';

const useStyles = (theme: any) => createStyles({
  [theme.breakpoints.down('md')]: {
    firstRow: {},
  },
  [theme.breakpoints.up('sm')]: {
    firstRow: {},
  },
  firstRow: {},
});

interface ExternalProps {
  resources: any,
  className?: string,
}

class Index extends React.PureComponent<ExternalProps> {
  render() {
    const { resources } = this.props;
    const resourcesTable: any[] = [];
    if (resources) {
      for (let i = 0; i < resources.length; i++) {
        const columns: any[] = [];
        columns.push(['Key', resources[i][0]]);
        columns.push(['Value', resources[i][1]]);
        resourcesTable.push(<ResourceViewTable key={i} columns={columns} />);
      }
    }
    return resourcesTable;
  }
}

export default withStyles(useStyles)(Index);
