import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const useStyles = () => createStyles({
  root: {
    padding: 16,
  },
  card: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 24,
  },
  headline: {
    paddingBottom: 8,
  },
});

interface IndexProps {
  classes: any;
  t: any;
}

class Index extends PureComponent<IndexProps> {
  render() {
    const { classes, t } = this.props;
    return (
      <div>
        <Helmet>
          <title>404</title>
        </Helmet>
        <Grid className={classes.root} container justify="center">
          <Grid item xs={12} md={8} lg={4}>
            <Card className={classes.card}>
              <Typography variant="h5" className={classes.headline}>
                {t('home.searchNotFound')}
              </Typography>
              <div dangerouslySetInnerHTML={{ __html: t('home.searchNotFoundDetail') }} />
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
