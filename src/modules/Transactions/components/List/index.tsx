import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { createStyles, withStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FileSaver from 'file-saver';
import { csvExport } from '@/utils/csvExport';
import Loading from '@/common/Loading';
import ListView from '@/common/View/ListView';
import Pagination from '@/common/View/Pagination';
import CenteredView from '@/common/View/CenteredView';
import TransactionTable from '../Table';
import { withRouter, RoutedProps } from '@/utils/withRouter';

const useStyles = (theme: any) =>
  createStyles({
    pagerArea: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
      color: theme.palette.getContrastText(theme.palette.background.paper),
    },
    downloadBtn: {
      margin: '12px',
    },
  });

interface ExternalProps {
  className?: string;
}

interface InternalProps {
  transactionList: any;
  isLoadingMore: boolean;
  getTransactionList: (contents: any, callback?: any) => any;
  classes: any;
  t: any;
}

interface Props extends ExternalProps, InternalProps, RoutedProps {}

interface IndexState {
  currentPage: number;
  resolvedFunction: any;
  csvRows: string[];
  selectedRows: string[];
  isDownloading: boolean;
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    transactionList: null,
    getTransactionList: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1,
      resolvedFunction: undefined,
      csvRows: [],
      selectedRows: [],
      isDownloading: false,
    };
  }

  componentDidMount() {
    const params = this.props.params;
    if (Number(params.page)) {
      this.fetchListPage(Number(params.page));
    } else {
      this.fetchListPage(this.state.currentPage);
    }
  }

  fetchListPage = (page: number) => {
    this.props.getTransactionList({ page }, () => {
      this.setState({
        currentPage: page,
      });
    });
  };

  pagination = (type: string) => {
    // transactions use timestamp as sort filed, so we can not jump to specific page
    // const hits = this.props.transactionList ? this.props.transactionList.contents : [];
    // const last = hits[hits.length - 1];
    // const after = last && last.sort || 0;
    if (type === 'prev' && this.state.currentPage > 1) {
      const page = this.state.currentPage - 1;
      this.props.navigate(`/main/transactions/${page}`);
      this.fetchListPage(page);
    } else if (type === 'next') {
      const page = this.state.currentPage + 1;
      this.props.navigate(`/main/transactions/${page}`);
      this.fetchListPage(page);
    }
  };

  render() {
    const { transactionList, isLoadingMore, className, classes, params, t } =
      this.props;
    const isInitialLoad = !transactionList;
    const transactions = (transactionList && transactionList.contents) || [];

    const handleSelectedRows = (checked: boolean, transaction: any) =>
      this.setState((prevState) => ({
        selectedRows: checked
          ? [...prevState.selectedRows, transaction]
          : prevState.selectedRows.filter(
              (item: any) => item.block_hash !== transaction.block_hash,
            ),
      }));

    const transactionsList = transactions.length ? (
      <TransactionTable
        transactions={transactions}
        handleSelectedRows={handleSelectedRows}
      />
    ) : (
      <CenteredView>
        <div className={classes.header}>
          <Typography variant="h5" gutterBottom className={classes.title}>
            {t('transaction.NoTransactionData')}
          </Typography>
        </div>
      </CenteredView>
    );

    const csvTitle = `"${t('common.Hash')}","${t('transaction.Type')}","${t(
      'common.Time',
    )}","${t('transaction.BlockHash')}","${t('transaction.BlockHeight')}","${t(
      'transaction.StateRootHash',
    )}","${t('transaction.Status')}","${t('common.GasUsed')}","${t(
      'transaction.Sender',
    )}","${t('transaction.FunctionModuleAddress')}","${t(
      'transaction.FunctionModuleName',
    )}","${t('transaction.FunctionName')}","${t(
      'transaction.TxnTypeArgs',
    )}","${t('transaction.arg')} 1","${t('transaction.arg')} 2","${t(
      'transaction.arg',
    )} 3"`;

    const handleDownload = () => {
      this.setState({
        isDownloading: true,
      });

      this.setState(
        (prevState) => ({
          csvRows: prevState.selectedRows.map((item: any) =>
            csvExport(item, params.network, this),
          ),
        }),
        () => {
          const blob = new Blob(
            [`${csvTitle}\r\n${this.state.csvRows.join('\r\n')}`],
            { type: 'text/plain;charset=utf-8' },
          );

          FileSaver.saveAs(blob, `${this.state.currentPage}.csv`);

          this.setState({
            isDownloading: false,
            selectedRows: [],
          });
        },
      );
    };

    const handleDownloadAll = () => {
      this.setState({ selectedRows: transactions }, handleDownload);
    };

    return (
      <div>
        <Helmet>
          <title>{t('header.transactions')}</title>
        </Helmet>
        <ListView
          className={className}
          title={t('header.transactions')}
          name={t('header.transactions')}
          pluralName={t('header.transactions')}
          content={
            <div>
              {isInitialLoad ? <Loading /> : transactionsList}
              <div className={classes.pagerArea}>
                <Pagination
                  page={this.state.currentPage}
                  pageSize={20}
                  currentPageSize={
                    transactions == null ? null : transactions.length
                  }
                  hasPreviousPage={this.state.currentPage > 1}
                  hasNextPage={!!true}
                  onPrevPage={() => this.pagination('prev')}
                  onNextPage={() => this.pagination('next')}
                  isLoading={isLoadingMore}
                />
                <Button
                  variant="contained"
                  className={classes.downloadBtn}
                  onClick={handleDownload}
                  disabled={
                    this.state.isDownloading ||
                    this.state.selectedRows.length === 0
                  }
                >
                  Download Selected
                </Button>
                <Button
                  variant="contained"
                  className={classes.downloadBtn}
                  onClick={handleDownloadAll}
                  disabled={this.state.isDownloading}
                >
                  Download All
                </Button>
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(withRouter(Index)));
