import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { createStyles, withStyles } from '@mui/styles';
import Helmet from 'react-helmet';
import Markdown from '@/common/Markdown';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CenteredView from '@/common/View/CenteredView';

const useStyles = (theme: any) => createStyles({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
  [theme.breakpoints.down('md')]: {
    header: {
      padding: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    header: {
      padding: theme.spacing(2) ,
    },
  },
  header: {
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  title: {
    fontWeight: 700,
  },
});

interface IndexProps {
  classes: any;
  t: any,
}

class Index extends PureComponent<IndexProps> {
  render() {
    const { t, classes } = this.props;
    const title = t('header.terms');
    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <CenteredView>
          <Card>
            <div className={classes.header}>
              <Typography variant='h5' gutterBottom className={classes.title}>
                {title}
              </Typography>
            </div>
            <div className={classes.root}>
              <Markdown indexWord='terms' />
            </div>
          </Card>
        </CenteredView>
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
