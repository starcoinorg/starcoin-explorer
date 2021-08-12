import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// @ts-ignore
import createLoadingSelector  from '@/rootStore/loading/selector';
import store from '@/Tokens/store';
import * as types from '@/Tokens/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_TOKEN_LIST]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    tokenList: current.tokenList,
    isLoadingMore: current.isLoadingMore,
    loading
  })
);

export default connect(selector, {
  getTokenList: actions.getTokenList
})(Index) as any;