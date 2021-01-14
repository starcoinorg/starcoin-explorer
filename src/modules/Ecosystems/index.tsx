import React, { PureComponent } from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Helmet from 'react-helmet';
import { sha3_256 } from 'js-sha3';
import Card from '@material-ui/core/Card';
import CommonHeader from '@/common/View/CommonHeader';
import CenteredView from '@/common/View/CenteredView';
import EcosystemCard from './EcosystemCard';
import cards from './cards';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('xs')]: {
    gridCards: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridGap: `${theme.spacing(1) * 2}px ${theme.spacing(1) * 2}px`,
      padding: theme.spacing(1) * 2,
    },
  },
  [theme.breakpoints.up('sm')]: {
    gridCards: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: `${theme.spacing(1) * 2}px ${theme.spacing(1) * 2}px`,
      padding: theme.spacing(1) * 2,
    },
  },
  [theme.breakpoints.up('lg')]: {
    gridCards: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: `${theme.spacing(1) * 2}px ${theme.spacing(1) * 2}px`,
      padding: theme.spacing(1) * 2,
    },
  },
});

interface IndexProps {
  classes: any;
}

class Index extends PureComponent<IndexProps> {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Helmet>
          <title>Ecosystem</title>
        </Helmet>
        <CenteredView>
          <Card>
            <CommonHeader name="Ecosystem" pluralName="Ecosystem" />
            <div className={classes.gridCards}>
              {cards.map(({ title, description, link, image, cover }) => (
                <EcosystemCard
                  key={sha3_256(title)}
                  title={title}
                  description={description}
                  link={link}
                  image={image}
                  cover={cover}
                />
              ))}
            </div>
          </Card>
        </CenteredView>
      </div>
    );
  }
}

export default withStyles(useStyles)(Index);
