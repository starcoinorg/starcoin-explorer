import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Loading from '@/common/Loading';
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
  computedMatch: any;
  searchKeyword: (data: any, callback?: any) => any;
}

interface IndexState {
  showLoading: boolean,
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    computedMatch: {},
    searchKeyword: () => {},
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      showLoading: true,
    };
  }

  componentDidMount() {
    let keyword = this.props.computedMatch.params.keyword;
    if (keyword.indexOf(',') > 0) {
      keyword = keyword.replace(',', '');
    }
    this.props.searchKeyword(keyword, () => this.showNotFound());
  }

  showNotFound() {
    this.setState({ showLoading: false });
  }

  render() {
    const { classes, t } = this.props;
    if (this.state.showLoading) {
      return <Loading />;
    }

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
              <Typography variant="subtitle1">
                {t('home.searchNotFoundDetail')}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
