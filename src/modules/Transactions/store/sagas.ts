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

const sagas = [
  watchGetTransaction
];

export default sagas;