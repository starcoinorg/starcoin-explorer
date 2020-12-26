import { all, fork } from 'redux-saga/effects';
import transactions from '@/Transactions/store';
import routerSaga from './router/sagas';

const sagas = [
  ...transactions.sagas,
  ...routerSaga
];

function* rootSaga () {
  yield all(sagas.map(saga => fork(saga)));
};

export default rootSaga;