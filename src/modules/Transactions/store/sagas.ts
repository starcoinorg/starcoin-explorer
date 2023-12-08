import { call, put, takeLatest, fork, delay } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as sdk from '@/utils/sdk';
import * as api from './apis';
import * as actions from './actions';
import * as types from './constants';
import { POLLING_INTERVAL } from '@/utils/constants';

export function* getTransaction(action: ReturnType<typeof actions.getTransaction>) {
  try {
    // @ts-ignore
    const res = yield call(withLoading, api.getTransaction, action.type, action.payload);
    yield put(actions.setTransaction(res));
  } catch ({ message }) {
    if (message) {
      console.log(message);
    }
  }
}

function* watchGetTransaction() {
  yield takeLatest(types.GET_TRANSACTION, getTransaction);
}

export function* getPendingTransaction(action: ReturnType<typeof actions.getPendingTransaction>) {
  try {
    // @ts-ignore
    const res = yield call(withLoading, api.getPendingTransaction, action.type, action.payload);
    yield put(actions.setPendingTransaction(res));
  } catch ({ message }) {
    if (message) {
      console.log(message);
    }
  }
}

function* watchGetPendingTransaction() {
  yield takeLatest(types.GET_PENDING_TRANSACTION, getPendingTransaction);
}

export function* getTransactionList(action: ReturnType<typeof actions.getTransactionList>) {
  try {
    // @ts-ignore
    const res = yield call(withLoading, api.getTransactionList, action.type, action.payload);
    yield put(actions.setTransactionList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch ({ message }) {
    if (message) {
      yield put(actions.setTransactionList([]));
    }
  } finally {
    yield put(actions.getTransactionListInDelay(action.payload));
  }
}

function* watchGetTransactionList() {
  yield takeLatest(types.GET_TRANSACTION_LIST, getTransactionList);
}

export function* getPendingTransactionList(action: ReturnType<typeof actions.getPendingTransactionList>) {
  try {
    // @ts-ignore
    const res = yield call(withLoading, api.getPendingTransactionList, action.type, action.payload);
    yield put(actions.setPendingTransactionList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch ({ message }) {
    if (message) {
      yield put(actions.setPendingTransactionList([]));
    }
  } finally {
    yield put(actions.getPendingTransactionListInDelay(action.payload));
  }
}

function* watchGetPendingTransactionList() {
  yield takeLatest(types.GET_PENDING_TRANSACTION_LIST, getPendingTransactionList);
}

export function* getAddressTransactionList(action: ReturnType<typeof actions.getAddressTransactionList>) {
  try {
    // @ts-ignore
    const res = yield call(withLoading, api.getAddressTransactionList, action.type, action.payload);
    yield put(actions.setAddressTransactionList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch ({ message }) {
    if (message) {
      yield put(actions.setAddressTransactionList([]));
    }
  } finally {
    yield put(actions.getAddressTransactionListInDelay(action.payload));
  }
}

function* watchGetAddressTransactionList() {
  yield takeLatest(types.GET_ADDRESS_TRANSACTION_LIST, getAddressTransactionList);
}

export function* getAddressTransactions(action: ReturnType<typeof actions.getAddressTransactions>) {
  try {
    // @ts-ignore
    const res = yield call(withLoading, api.getAddressTransactions, action.type, action.payload);
    yield put(actions.setAddressTransactions(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch ({ message }) {
    if (message) {
      console.log(message);
    }
  }
}

function* watchGetAddressTransactions() {
  yield takeLatest(types.GET_ADDRESS_TRANSACTIONS, getAddressTransactions);
}

export function* getBlockTransactions(action: ReturnType<typeof actions.getBlockTransactions>) {
  try {
    // @ts-ignore
    const res = yield call(withLoading, api.getBlockTransactions, action.type, action.payload);
    yield put(actions.setBlockTransactions(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch ({ message }) {
    if (message) {
      console.log(message);
    }
  }
}

function* watchGetBlockTransactions() {
  yield takeLatest(types.GET_BLOCK_TRANSACTIONS, getBlockTransactions);
}


export function* getBlockTransactionsByHeight(action: ReturnType<typeof actions.getBlockTransactions>) {
  try {
    // @ts-ignore
    const res = yield call(withLoading, api.getBlockTransactionsByHeight, action.type, action.payload);
    yield put(actions.setBlockTransactions(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch ({ message }) {
    if (message) {
      console.log(message);
    }
  }
}

function* watchGetBlockTransactionsByHeight() {
  yield takeLatest(types.GET_BLOCK_TRANSACTIONS_BY_HEIGHT, getBlockTransactionsByHeight);
}

export function* getTransactionListInDelay(action: ReturnType<typeof actions.getTransactionList>) {
  const url = window.location.href;
  if (action.payload.page === 1 && (url.endsWith('/') || url.endsWith('/transactions') || url.endsWith('/transactions/1'))) {
    yield delay(POLLING_INTERVAL);
    yield fork(getTransactionList, actions.getTransactionList(action.payload));
  }
}

function* watchGetTransactionListInDelay() {
  yield takeLatest(types.GET_TRANSACTION_LIST_IN_DELAY, getTransactionListInDelay);
}



export function* getModuleFunctionIndex(action: ReturnType<typeof actions.getModuleFunctionIndex>) {
  try {
    // @ts-ignore
    const res = yield call(sdk.getResolveModuleFunctionIndex, action.payload.moduleId, action.payload.index);
    yield put(actions.setModuleFunctionIndex(res));
  } catch ({ message }) {
    if (message) {
      console.log(message);
    }
  }
}

function* watchGetModuleFunctionIndex() {
  yield takeLatest(types.GET_MODULE_FUNCTION_INDEX, getModuleFunctionIndex);
}

const sagas = [
  watchGetTransaction,
  watchGetPendingTransaction,
  watchGetTransactionList,
  watchGetPendingTransactionList,
  watchGetAddressTransactionList,
  watchGetTransactionListInDelay,
  watchGetAddressTransactions,
  watchGetBlockTransactions,
  watchGetBlockTransactionsByHeight,
  watchGetModuleFunctionIndex,
];

export default sagas;
