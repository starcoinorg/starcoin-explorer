import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector  from '@/rootStore/loading/selector';
import store from '@/Blocks/store';
import * as types from '@/Blocks/store/constants';
import * as typesTransactions from '@/Transactions/store/constants';
import storeTransactions from '@/Transactions/store';
import Index from './index';

const { selector: currentSelector, actions } = store;
const { selector: currentSelectorTransactions, actions: actionsTransactions } = storeTransactions;

const loadingSelector = createLoadingSelector([types.GET_BLOCK, typesTransactions.GET_BLOCK_TRANSACTIONS]);

const selector = createSelector(
  currentSelector,
  currentSelectorTransactions,
  loadingSelector,
  (current, transactions, loading) => ({
    block: current.block,
    blockTransactions: transactions.blockTransactions,
    loading
  })
);

export default connect(selector, {
  getBlock: actions.getBlock,
  getBlockTransactions: actionsTransactions.getBlockTransactions
})(Index) as any;