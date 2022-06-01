import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { encoding } from '@starcoin/starcoin';
import { createStyles, withStyles } from '@mui/styles';
import { Helmet } from 'react-helmet-async';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CenteredView from '@/common/View/CenteredView';

const useStyles = (theme: any) => createStyles({
  root: {
    padding: theme.spacing(2) ,

    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
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
    borderBottom: theme.palette.mode === 'dark' ?  '1px solid rgba(256, 256, 256, 0.075)' : '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
  },
  title: {
    fontWeight: 700,
  },
  [theme.breakpoints.down('md')]: {
    cardContainer: {
      marginBottom: theme.spacing(1),
    },
    blocks: {
      marginBottom: theme.spacing(1),
    },
    cardHeader: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    searchField: {
      padding: theme.spacing(1),
    },
    resultField: {
      padding: theme.spacing(1),
    },
    title: {
      fontSize: '1.125rem',
    },
    metric: {
      paddingLeft: theme.spacing(2),
    },
  },
  [theme.breakpoints.up('sm')]: {
    cardContainer: {
      marginBottom: theme.spacing(2),
    },
    cardHeader: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    searchField: {
      padding: theme.spacing(2),
    },
    resultField: {
      padding: theme.spacing(2),
    },
    title: {
      fontSize: '1.325rem',
    },
    metric: {
      paddingLeft: theme.spacing(4),
    },
  },
  [theme.breakpoints.down('lg')]: {
    blocksAndTransactions: {
      flexWrap: 'wrap',
    },
    blocks: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    transactions: {
      width: '100%',
    },
    textFieldLabel: {
      fontSize: '0.75em',
    },
  },
  [theme.breakpoints.up('md')]: {
    blocks: {
      width: '50%',
    },
    blocksSpacer: {
      paddingRight: theme.spacing(1),
    },
    transactions: {
      width: '50%',
    },
    transactionsSpacer: {
      paddingLeft: theme.spacing(1),
    },
    textFieldLabel: {
      fontSize: '1em',
    },
  },
  cardContainer: {},
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
  cardHeader: {
    alignItems: 'center',
    borderBottom: theme.palette.mode === 'dark' ?  '1px solid rgba(256, 256, 256, 0.075)' : '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  blocksAndTransactions: {
    display: 'flex',
  },
  blocks: {
    flex: '1 1 auto',
  },
  blocksSpacer: {},
  transactionsSpacer: {},
  transactions: {
    flex: '1 1 auto',
  },
  searchField: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
  },
  resultField: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
  },
  textField: {
    display: 'flex',
    flex: '1 1 auto',
    marginRight: theme.spacing(1),
    "& .MuiInputBase-input":{
      color: theme.palette.getContrastText(theme.palette.background.paper),
      borderColor:"red",

    },
    "& .MuiInputLabel-root":{
      color:  theme.palette.mode === 'dark' ? theme.palette.grey[500] : undefined ,
    }
  },
  textFieldLabel: {},
  button: {
    height: theme.spacing(5),
    minWidth: '8rem',
    maxWidth: '4rem',
    marginLeft: theme.spacing(1),
  },
  search: {},
});

interface IndexProps {
  classes: any;
  t: any,
}

interface IndexState {
  input_public_key: string,
  output_receipt_identifier: string,
  input_receipt_identifier: string,
  output_address: string
}

class Index extends PureComponent<IndexProps, IndexState> {
  constructor(props: IndexProps) {
    super(props);
    this.state = {
      input_public_key: '',
      output_receipt_identifier: '',
      input_receipt_identifier: '',
      output_address: '',
    };
  }

  onPublicKeyChange = (event: any) => {
    const { value: input_public_key } = event.target;
    this.setState({ input_public_key });
  };

  onTransformPublickKeyToReceiptIdentifier = async () => {
    const inputPublicKey = (document.getElementById('publicKeyInput') as HTMLInputElement).value;
    let receipt_identifier: string;
    if (inputPublicKey.length !== 66) {
      alert('Please input the correct public key!'); // eslint-disable-line no-alert
      receipt_identifier = '';
    } else {
      receipt_identifier = encoding.publicKeyToReceiptIdentifier(inputPublicKey);
    }
    this.setState({ output_receipt_identifier: receipt_identifier });
  };

  onReceiptIdentifierChange = (event: any) => {
    const { value: input_receipt_identifier } = event.target;
    this.setState({ input_receipt_identifier });
  };

  onTransformReceiptIdentifierToAddress = async () => {
    const inputReceiptIdentifier = (document.getElementById('receiptIdentifierInput') as HTMLInputElement).value;
    let address: string;
    if (inputReceiptIdentifier.length !== 88) {
      alert('Please input the correct receipt identifier!'); // eslint-disable-line no-alert
      address = '';
    } else {
      const decodedReceiptIdentifier = encoding.decodeReceiptIdentifier(inputReceiptIdentifier);
      address = `0x${decodedReceiptIdentifier.accountAddress}`;
    }
    this.setState({ output_address: address });
  };

  render() {
    const { t, classes } = this.props;
    const title = t('header.tools');
    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <CenteredView>
          <Card className={this.props.classes.card}>
            <div className={this.props.classes.cardHeader}>
              <Typography className={classes.title}
                          variant='h4'>{t('tools.publickey_to_receipt_identifier')}</Typography>
            </div>
            <div className={classes.searchField}>
              <TextField
                id='publicKeyInput'
                className={classes.textField}
                value={this.state.input_public_key}
                label={t('tools.input_publickey_hint')}
                InputLabelProps={{ className: classes.textFieldLabel }}
                onChange={this.onPublicKeyChange}
                variant='standard'
              />
            </div>
            <Button
              className={classes.button}
              color='primary'
              variant='contained'
              onClick={this.onTransformPublickKeyToReceiptIdentifier}
            >
              <Typography className={classes.search} variant='body1'>
                {t('tools.transform')}
              </Typography>
            </Button>
            <div className={classes.resultField}>
              <TextField
                id='standard-basic'
                className={classes.textField}
                value={this.state.output_receipt_identifier}
                label={t('tools.output_receipt_identifier_hint')}
                InputLabelProps={{ className: classes.textFieldLabel }}
                variant='standard'
              />
            </div>
          </Card>
        </CenteredView>

        <CenteredView>
          <Card className={this.props.classes.card}>
            <div className={this.props.classes.cardHeader}>
              <Typography className={classes.title} variant='h4'>{t('tools.receipt_identifier_to_address')}</Typography>
            </div>
            <div className={classes.searchField}>
              <TextField
                id='receiptIdentifierInput'
                className={classes.textField}
                value={this.state.input_receipt_identifier}
                variant='standard'
                label={t('tools.input_receipt_identifier_hint')}
                InputLabelProps={{ className: classes.textFieldLabel }}
                onChange={this.onReceiptIdentifierChange}
              />
            </div>
            <Button
              className={classes.button}
              color='primary'
              variant='contained'
              onClick={this.onTransformReceiptIdentifierToAddress}
            >
              <Typography className={classes.search} variant='body1'>
                {t('tools.transform')}
              </Typography>
            </Button>
            <div className={classes.resultField}>
              <TextField
                id='standard-basic-2'
                variant='standard'
                className={classes.textField}
                value={this.state.output_address}
                label={t('tools.output_address_hint')}
                InputLabelProps={{ className: classes.textFieldLabel }}
              />
            </div>
          </Card>
        </CenteredView>

      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
