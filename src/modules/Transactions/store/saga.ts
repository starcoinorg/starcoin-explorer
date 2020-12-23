import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from './constants';

export function* getTransaction(action: ReturnType<typeof actions.getTransaction>) {

}

function* watchGetTransaction() {
  yield takeLatest(types.GET_TRANSACTION, getTransaction)
}
export default [
  watchGetTransaction
]