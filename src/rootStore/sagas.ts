import { all, fork } from 'redux-saga/effects';
import blocks from '@/Blocks/store';
import tokens from '@/Tokens/store';
import transactions from '@/Transactions/store';
import search from '@/Search/store';
import routerSaga from './router/sagas';

const sagas = [
  ...blocks.sagas,
  ...tokens.sagas,
  ...transactions.sagas,
  ...search.sagas,
  ...routerSaga
];

function* rootSaga () {
  yield all(sagas.map(saga => fork(saga)));
};

export default rootSaga;