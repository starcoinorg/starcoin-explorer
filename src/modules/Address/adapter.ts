import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector  from '@/rootStore/loading/selector';
import { pushLocation }  from '@/rootStore/router/actions';
import * as types from '@/Transactions/store/constants';
import storeTransactions from '@/Transactions/store';
import Index from './index';

const { selector: currentSelector, actions } = storeTransactions;

const loadingSelector = createLoadingSelector([types.GET_ADDRESS_TRANSACTIONS]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    addressTransactions: current.addressTransactions,
    loading
  })
);

export default connect(selector, {
  getAddressTransactions: actions.getAddressTransactions,
  pushLocation
})(Index) as any;