import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// @ts-ignore
import createLoadingSelector  from '@/rootStore/loading/selector';
import store from '@/Transactions/store';
import * as types from '@/Transactions/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_ADDRESS_TRANSACTION_LIST]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    addressTransactionList: current.addressTransactionList,
    isLoadingMore: current.isLoadingMore,
    loading
  })
);

export default connect(selector, {
  getAddressTransactionList: actions.getAddressTransactionList
})(Index) as any;