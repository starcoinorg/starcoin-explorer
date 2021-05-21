import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { getNetwork } from '@/utils/helper';
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
  address: any;
}

class Index extends PureComponent<IndexProps> {
  render() {
    const { classes, t, address } = this.props;
    const networkString = getNetwork() || 'main';
    const networkCapitalized = networkString.charAt(0).toUpperCase() + networkString.slice(1);
    return (
      <div>
        <Helmet>
          <title>Address Not Onchain</title>
        </Helmet>
        <Grid className={classes.root} container justify="center">
          <Grid item xs={12} md={8} lg={4}>
            <Card className={classes.card}>
              <Typography variant="h6" className={classes.headline}>
                {t('account.address')} <strong>{address}</strong> {t('account.notOnchain')} {networkCapitalized} {t('account.network')}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
