import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import NativeSelect from '@material-ui/core/NativeSelect';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PageView from '@/common/View/PageView';

const useStyles = () => createStyles({
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
    marginBottom: '1rem'
  }
});

interface IndexProps {
  classes: any;
  t: any;
  address: any;
}

class Index extends PureComponent<IndexProps> {

  generateExtra() {
    const { classes } = this.props;
    return (
      <div className={classes}>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>Transactions</Typography>
          </AccordionSummary>
        </Accordion>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>Resources</Typography>
          </AccordionSummary>
        </Accordion>
      </div>
    );
  }

  render() {
    const {  t, address } = this.props;

    const token = (
      <NativeSelect
        id="demo-customized-select-native"
        value='0x00000000000000000000000000000001::STC::STC'
      >
        <option>0 STC</option>
      </NativeSelect>
    );

    const columns = [
      [t('common.Hash'), address],
      [t('account.Authentication Key'), ''],
      [t('common.Sequence Number'), 0],
      [t('account.Module Upgrade Strategy'), 0],
      [t('common.Token'), token],
    ];

    return (
      <>
        <Helmet>
          <title>Not Onchain</title>
        </Helmet>
        <PageView
          id={address}
          title="Address"
          name="Address"
          bodyColumns={columns}
          extra={this.generateExtra()}
        />
      </>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
