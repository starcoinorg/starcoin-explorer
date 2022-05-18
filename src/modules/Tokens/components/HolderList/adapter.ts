import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// @ts-ignore
import createLoadingSelector from '@/rootStore/loading/selector';
import store from '@/Tokens/store';
import * as types from '@/Tokens/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_TOKEN_HOLDER_LIST]);


const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    tokenHolderList: current.tokenHolderList,
    isLoadingMore: current.isLoadingMore,
    loading,
  }),
);


export default connect(selector, {
  getTokenHolderList: actions.getTokenHolderList,
})(Index as any) as any;