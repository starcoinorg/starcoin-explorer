import React from 'react';
import Card from '@mui/material/Card';
import CenteredView from '@/common/View/CenteredView';
import CommonHeader from '@/common/View/CommonHeader';
import { createStyles, withStyles } from '@mui/styles';
import { withTranslation } from 'react-i18next';


const useStyles = (theme: any) => createStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',

  },

  card: {
    display: 'flex',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
    flexDirection: 'column',
  },
  cardHeader: {
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
});

interface ExternalProps {
  id?: string,
  title: string,
  name: string,
  pluralName: string,
  content: any,
  className?: string,
  classes: any
}


class Index extends React.PureComponent<ExternalProps> {
  render() {
    const { id, title, name, pluralName, content, className } = this.props;
    return (
      <CenteredView className={className}>
        <Card className={this.props.classes.card}>
          <CommonHeader id={id} title={title} name={name} pluralName={pluralName} />
          {content}
        </Card>
      </CenteredView>
    );
  }
}


export default withStyles(useStyles)(withTranslation()(Index));
