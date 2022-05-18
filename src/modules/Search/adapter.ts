import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector from '@/rootStore/loading/selector';
import storeSearch from '@/Search/store';
import * as typesSearch from '@/Search/store/constants';
import Index from './index';

const { actions } = storeSearch;

const loadingSelector = createLoadingSelector([typesSearch.SEARCH_KEYWORD]);

const selector = createSelector(
  loadingSelector,
  (loading) => ({
    loading,
  }),
);

export default connect(selector, {
  searchKeyword: actions.searchKeyword,
})(Index as any) as any;