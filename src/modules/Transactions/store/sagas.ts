import { call, put, takeLatest, fork, delay } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as api from './apis';
import * as actions from './actions';
import * as types from './constants';

const transactionPollingInterval = 5000;

export function* getTransaction(action: ReturnType<typeof actions.getTransaction>) {
  try {
    const res = yield call(withLoading, api.getTransaction, action.type, action.payload);
    yield put(actions.setTransaction(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetTransaction() {
  yield takeLatest(types.GET_TRANSACTION, getTransaction)
}

export function* getTransactionList(action: ReturnType<typeof actions.getTransactionList>): any {
  try {
    const res = yield call(withLoading, api.getTransactionList, action.type, action.payload);
    yield put(actions.setTransactionList(res.hits));
    if (action.callback) {
      yield call(action.callback);
    }
    if (action.payload.page === 1) {
      yield delay(transactionPollingInterval);
      yield fork(getTransactionList, action);
    }
  } catch (err) {
    if (err.message) {
      yield put(actions.setTransactionList([]));
    }
  }
}

function* watchGetTransactionList() {
  yield takeLatest(types.GET_TRANSACTION_LIST, getTransactionList)
}

export function* getAddressTransactions(action: ReturnType<typeof actions.getAddressTransactions>) {
  try {
    const res = yield call(withLoading, api.getAddressTransactions, action.type, action.payload);
    yield put(actions.setAddressTransactions(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetAddressTransactions() {
  yield takeLatest(types.GET_ADDRESS_TRANSACTIONS, getAddressTransactions)
}

export function* getBlockTransactions(action: ReturnType<typeof actions.getBlockTransactions>) {
  try {
    const res = yield call(withLoading, api.getBlockTransactions, action.type, action.payload);
    yield put(actions.setBlockTransactions(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetBlockTransactions() {
  yield takeLatest(types.GET_BLOCK_TRANSACTIONS, getBlockTransactions)
}


export function* getBlockTransactionsByHeight(action: ReturnType<typeof actions.getBlockTransactions>) {
  try {
    const res = yield call(withLoading, api.getBlockTransactionsByHeight, action.type, action.payload);
    yield put(actions.setBlockTransactions(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetBlockTransactionsByHeight() {
  yield takeLatest(types.GET_BLOCK_TRANSACTIONS_BY_HEIGHT, getBlockTransactionsByHeight)
}

const sagas = [
  watchGetTransaction,
  watchGetTransactionList,
  watchGetAddressTransactions,
  watchGetBlockTransactions,
  watchGetBlockTransactionsByHeight
];

export default sagas;