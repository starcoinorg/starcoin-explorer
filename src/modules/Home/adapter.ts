import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector  from '@/rootStore/loading/selector';
import storeBlocks from '@/Blocks/store';
import storeTransactions from '@/Transactions/store';
import * as typesBlocks from '@/Blocks/store/constants';
import * as typesTransactions from '@/Transactions/store/constants';
import Index from './index';

const { selector: currentSelectorBlocks, actions: actionsBlocks } = storeBlocks;
const { selector: currentSelectorTransactions, actions: actionsTransactions } = storeTransactions;

const loadingSelector = createLoadingSelector([typesBlocks.GET_BLOCK_LIST, typesTransactions.GET_TRANSACTION_LIST]);

const selector = createSelector(
  currentSelectorBlocks,
  currentSelectorTransactions,
  loadingSelector,
  (currentBlocks, currentTransactions, loading) => ({
    blockList: currentBlocks.blockList,
    transactionList: currentTransactions.transactionList,
    loading
  })
);

export default connect(selector, {
  getBlockList: actionsBlocks.getBlockList,
  getTransactionList: actionsTransactions.getTransactionList
})(Index) as any;