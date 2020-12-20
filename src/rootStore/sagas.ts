import { all, fork } from 'redux-saga/effects';
import routerSaga from './router/sagas';

const sagas = [
  ...routerSaga
];

function* rootSaga () {
  yield all(sagas.map(saga => fork(saga)));
};

export default rootSaga;