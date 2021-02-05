import { all, call, put, takeLatest } from 'redux-saga/effects';
import get from "lodash/get";
import withLoading from '@/sagaMiddleware/index';
import {isHex} from "@/utils/helper";
import { getBlock, getBlockByHeight } from '@/Blocks/store/apis';
import { getTransaction, getAddressTransactions } from '@/Transactions/store/apis';
import { pushLocation }  from '@/rootStore/router/actions';
import { getAddressData } from '@/utils/sdk';
import * as actions from './actions';
import * as types from './constants';

export function* searchKeyword(action: ReturnType<typeof actions.searchKeyword>) {
  try {
    let res = [];
    if (isHex(action.payload)) {
      res = yield all([
        call(withLoading, getBlock, action.type, { hash: action.payload }),
        call(withLoading, getTransaction, action.type, { hash: action.payload }),
        call(withLoading, getAddressTransactions, action.type, { hash: action.payload })
      ]);
    } else {
      const height = parseInt(action.payload, 10)
      if (height >= 0) {
        res = yield all([
          call(withLoading, getBlockByHeight, action.type, { height }),
        ]);
      }
    }
    let url;
    // found block
    if (res[0] && res[0].hits.hits.length > 0) {
      // by hash
      if (isHex(action.payload) && get(res[0], 'hits.hits[0]._id') === action.payload) {
        url = `/blocks/detail/${action.payload}`;
      // by height
      } else if (get(res[0], 'hits.hits[0]._source.header.number') === action.payload) {
        url = `/blocks/height/${action.payload}`;
      }
    }
    // found transaction by hash
    if (!url && isHex(action.payload) && res[1] && res[1].hits.hits.length > 0) {
      if (get(res[1], 'hits.hits[0]._id') === action.payload) {
        url = `/transactions/detail/${action.payload}`;
      }
    }
    // found address by hash
    if (!url && isHex(action.payload) && res[2] && res[2].hits.hits.length > 0) {
      const data = yield call(getAddressData, action.payload);
      if (data) {
        if (get(data, 'withdraw_events.guid') === action.payload) {
          url = `/address/${action.payload}`;
        }
      }
    }


    if (url) {
      yield put(pushLocation(url));
    } else {
      if (action.callback) {
        yield call(action.callback);
      }
    }
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchSearchKeyword() {
  yield takeLatest(types.SEARCH_KEYWORD, searchKeyword)
}

const sagas = [
  watchSearchKeyword
];

export default sagas;