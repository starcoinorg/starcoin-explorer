import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { createStyles, withStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import PageView from '@/common/View/PageView';
import TokenTable from "@/Address/components/TokenTable";

const useStyles = (theme:any) => createStyles({
  table: {
    width: '100%',
  },
  shrinkMaxCol: {
    flex: '1 100 auto',
    minWidth: 60,
  },
  shrinkCol: {
    flex: '1 10 auto',
  },
  button: {
    marginLeft: '1rem',
    marginBottom: '1rem',
  },
  accordion: {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
});

interface IndexProps {
  classes: any;
  t: any;
  address: any;
}

class Index extends PureComponent<IndexProps> {

  generateExtra() {
    const { classes , t} = this.props;
    return (
      <div className={classes.root}>

        <br />
        <Accordion expanded className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography variant='h5' gutterBottom>{t('header.tokens')}</Typography>
          </AccordionSummary>
          <AccordionDetails >
            <div className={classes.table}>
              <TokenTable address=""/>
            </div>
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion classes={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'

          >
            <Typography variant='h5' gutterBottom>Transactions</Typography>
          </AccordionSummary>
        </Accordion>
        <br />
        <Accordion classes={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography variant='h5' gutterBottom>Resources</Typography>
          </AccordionSummary>
        </Accordion>
      </div>
    );
  }

  render() {
    const { t, address } = this.props;

    const columns = [
      [t('common.Hash'), address],
      [t('account.Authentication Key'), ''],
      [t('common.Sequence Number'), 0],
      [t('account.Module Upgrade Strategy'), 0],
    ];

    return (
      <>
        <Helmet>
          <title>Not Onchain</title>
        </Helmet>
        <PageView
          id={address}
          title='Address'
          name='Address'
          bodyColumns={columns}
          extra={this.generateExtra()}
        />
      </>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
