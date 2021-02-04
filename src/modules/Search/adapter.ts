import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector  from '@/rootStore/loading/selector';
import { pushLocation }  from '@/rootStore/router/actions';
import storeBlocks from '@/Blocks/store';
import storeTransactions from '@/Transactions/store';
import * as typesBlocks from '@/Blocks/store/constants';
import * as typesTransactions from '@/Transactions/store/constants';
import Index from './index';

const { selector: currentSelectorBlocks, actions: actionsBlocks } = storeBlocks;
const { selector: currentSelectorTransactions, actions: actionsTransactions } = storeTransactions;

const loadingSelector = createLoadingSelector([typesBlocks.GET_BLOCK, typesTransactions.GET_TRANSACTION, typesTransactions.GET_ADDRESS_TRANSACTIONS]);

const selector = createSelector(
  currentSelectorBlocks,
  currentSelectorTransactions,
  loadingSelector,
  (currentBlocks, currentTransactions, loading) => ({
    block: currentBlocks.block,
    transaction: currentTransactions.transaction,
    addressTransactions: currentTransactions.addressTransactions,
    loading
  })
);

export default connect(selector, {
  getBlock: actionsBlocks.getBlock,
  getTransaction: actionsTransactions.getTransaction,
  getAddressTransactions: actionsTransactions.getAddressTransactions,
  pushLocation
})(Index) as any;