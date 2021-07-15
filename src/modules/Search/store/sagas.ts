import { all, call, put, takeLatest } from 'redux-saga/effects';
import get from "lodash/get";
import withLoading from '@/sagaMiddleware/index';
import { isHex } from "@/utils/helper";
import { getBlock, getBlockByHeight, getUncleBlock } from '@/Blocks/store/apis';
import { getTransaction, getAddressTransactions, getPendingTransaction } from '@/Transactions/store/apis';
import { pushLocation } from '@/rootStore/router/actions';
import { getAddressData } from '@/utils/sdk';
import { getNetwork } from '@/utils/helper';
import * as actions from './actions';
import * as types from './constants';

export function* searchKeyword(action: ReturnType<typeof actions.searchKeyword>) {
  try {
    let res = [];
    if (isHex(action.payload)) {
      res = yield all([
        call(withLoading, getBlock, action.type, { hash: action.payload }),
        call(withLoading, getTransaction, action.type, { hash: action.payload }),
        call(withLoading, getAddressTransactions, action.type, { hash: action.payload }),
        call(withLoading, getUncleBlock, action.type, { hash: action.payload }),
        call(withLoading, getPendingTransaction, action.type, { hash: action.payload })
      ]);
    } else {
      const height = parseInt(action.payload, 10);
      if (height >= 0) {
        res = yield all([
          call(withLoading, getBlockByHeight, action.type, { height }),
        ]);
      }
    }
    let url;
    // found block
    if (res[0]) {
      // by hash
      if (isHex(action.payload) && get(res[0], 'header.block_hash') === action.payload) {
        url = `/${ getNetwork() }/blocks/detail/${ action.payload }`;
        // by height
      } else if (get(res[0], 'header.number') == action.payload) {
        url = `/${ getNetwork() }/blocks/height/${ action.payload }`;
      }

    }
    // found transaction by hash
    if (!url && isHex(action.payload) && res[1]) {
      if (get(res[1], 'transaction_hash') === action.payload) {
        url = `/${ getNetwork() }/transactions/detail/${ action.payload }`;
      }
    }
    // found address by hash
    if (!url && isHex(action.payload)) {
      if (res[2]) {
        const data = yield call(getAddressData, action.payload);
        if (data) {
          url = `/${ getNetwork() }/address/${ action.payload }`;
        }
      } else if (action.payload.length === 34) {
        // fallback to determine address by hash length
        url = `/${ getNetwork() }/address/${ action.payload }`;
      }
    }

    // found uncle block
    if (res[3]) {
      url = `/${ getNetwork() }/uncleblocks/hash/${ action.payload }`
    }
    // found Txn pending
    if (res[4]) {
      url = `/${ getNetwork() }/pending_transactions/detail/${ action.payload }`
    }

    if (url) {
      yield put(pushLocation(url));
    } else {
      if (action.callback) {
        // hide loading, show not found
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