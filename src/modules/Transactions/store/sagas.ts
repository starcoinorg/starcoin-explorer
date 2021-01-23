import { call, put, takeLatest } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as api from './apis';
import * as actions from './actions';
import * as types from './constants';

export function* getTransaction(action: ReturnType<typeof actions.getTransaction>) {
  try {
    const res = yield call(withLoading, api.getTransaction, action.type, action.payload);
    yield put(actions.setTransaction(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
      // yield call(message.error, err.message);
    }
  }
}

function* watchGetTransaction() {
  yield takeLatest(types.GET_TRANSACTION, getTransaction)
}

export function* getTransactionList(action: ReturnType<typeof actions.getTransactionList>) {
  try {
    const res = yield call(withLoading, api.getTransactionList, action.type, action.payload);
    yield put(actions.setTransactionList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      console.log(err.message);
      // yield call(message.error, err.message);
    }
  }
}

function* watchGetTransactionList() {
  yield takeLatest(types.GET_TRANSACTION_LIST, getTransactionList)
}


export function* getAddressTransactions(action: ReturnType<typeof actions.getAddressTransactions>) {
  try {
    const res = yield call(withLoading, api.getAddresssTransactions, action.type, action.payload);
    yield put(actions.setAddressTransactions(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      console.log(err.message);
      // yield call(message.error, err.message);
    }
  }
}

function* watchGetAddressTransactions() {
  yield takeLatest(types.GET_ADDRESS_TRANSACTIONS, getAddressTransactions)
}

const sagas = [
  watchGetTransaction,
  watchGetTransactionList,
  watchGetAddressTransactions
];

export default sagas;