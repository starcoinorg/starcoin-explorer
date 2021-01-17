import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Helmet from 'react-helmet';
import Markdown from '@/common/Markdown';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CenteredView from '@/common/View/CenteredView';
import FAQ from './faq.md';

const useStyles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(1) * 2,
    paddingTop: 0,
  },
  [theme.breakpoints.down('sm')]: {
    header: {
      padding: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    header: {
      padding: theme.spacing(1) * 2,
    },
  },
  header: {
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
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
    const title = t('header.faq');
    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <CenteredView>
          <Card>
            <div className={classes.header}>
              <Typography variant="h5" gutterBottom className={classes.title}>
                {title}
              </Typography>
            </div>
            <div className={classes.root}>
              <Markdown source={FAQ} />
            </div>
          </Card>
        </CenteredView>
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
