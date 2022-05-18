import { call, put, takeLatest, delay, fork } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as api from './apis';
import * as actions from './actions';
import * as types from './constants';
import { POLLING_INTERVAL } from '@/utils/constants';

export function* getTokenInfo(action: ReturnType<typeof actions.getTokenInfo>) {
  try {
    const res = yield call(withLoading, api.getTokenInfo, action.type, action.payload);
    yield put(actions.setTokenInfo(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetTokenInfo() {
  yield takeLatest(types.GET_TOKEN_INFO, getTokenInfo);
}

export function* getTokenList(action: ReturnType<typeof actions.getTokenList>) {
  try {
    const res = yield call(withLoading, api.getTokenList, action.type, action.payload);
    yield put(actions.setTokenList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      yield put(actions.setTokenList([]));
    }
  } finally {
    yield put(actions.getTokenListInDelay(action.payload));
  }
}

export function* getTokenHolderList(action: ReturnType<typeof actions.getTokenHolderList>) {
  try {
    const res = yield call(withLoading, api.getTokenHolderList, action.type, action.payload);
    yield put(actions.setTokenHolderList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      yield put(actions.setTokenHolderList([]));
    }
  } finally {
    yield put(actions.getTokenHolderListInDelay(action.payload));
  }
}

export function* getTokenTransactionList(action: ReturnType<typeof actions.getTokenTransactionList>) {
  try {
    const res = yield call(withLoading, api.getTokenTransactionList, action.type, action.payload);
    yield put(actions.setTokenTransactionList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      yield put(actions.setTokenTransactionList([]));
    }
  } finally {
    yield put(actions.getTokenTransactionListInDelay(action.payload));
  }
}

function* watchGetTokenList() {
  yield takeLatest(types.GET_TOKEN_LIST, getTokenList);
}

function* watchGetTokenHolderList() {
  yield takeLatest(types.GET_TOKEN_HOLDER_LIST, getTokenHolderList);
}

function* watchGetTokenTransactionList() {
  yield takeLatest(types.GET_TOKEN_TRANSACTION_LIST, getTokenTransactionList);
}

export function* getTokenListInDelay(action: ReturnType<typeof actions.getTokenList>) {
  const url = window.location.href;
  if (action.payload.page === 1 && (url.endsWith('/') || url.endsWith('/token') || url.endsWith('/1'))) {
    yield delay(POLLING_INTERVAL);
    yield fork(getTokenList, actions.getTokenList(action.payload));
  }
}

export function* getTokenHolderListInDelay(action: ReturnType<typeof actions.getTokenHolderList>) {
  const url = window.location.href;
  if (action.payload.page === 1 && (url.includes('/holders') || url.endsWith('/1'))) {
    yield delay(POLLING_INTERVAL);
    yield fork(getTokenHolderList, actions.getTokenHolderList(action.payload));
  }
}

export function* getTokenTransactionListInDelay(action: ReturnType<typeof actions.getTokenTransactionList>) {
  const url = window.location.href;
  if (action.payload.page === 1 && (url.includes('/tokens/transactions/') || url.endsWith('/1'))) {
    yield delay(POLLING_INTERVAL);
    yield fork(getTokenTransactionList, actions.getTokenTransactionList(action.payload));
  }
}

function* watchGetTokenListInDelay() {
  yield takeLatest(types.GET_TOKEN_LIST_IN_DELAY, getTokenListInDelay);
}

function* watchGetTokenHolderListInDelay() {
  yield takeLatest(types.GET_TOKEN_HOLDER_LIST_IN_DELAY, getTokenHolderListInDelay);
}

function* watchGetTokenTransactionListInDelay() {
  yield takeLatest(types.GET_TOKEN_TRANSACTION_LIST_IN_DELAY, getTokenTransactionListInDelay);
}

const sagas = [
  watchGetTokenInfo,
  watchGetTokenList,
  watchGetTokenHolderList,
  watchGetTokenTransactionList,
  watchGetTokenListInDelay,
  watchGetTokenHolderListInDelay,
  watchGetTokenTransactionListInDelay,
];

export default sagas;