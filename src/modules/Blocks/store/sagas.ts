import { call, put, takeLatest, delay, fork } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as api from './apis';
import * as actions from './actions';
import * as types from './constants';
import { POLLING_INTERVAL } from '@/utils/constants'

export function* getBlock(action: ReturnType<typeof actions.getBlock>) {
  try {
    const res = yield call(withLoading, api.getBlock, action.type, action.payload);
    yield put(actions.setBlock(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetBlock() {
  yield takeLatest(types.GET_BLOCK, getBlock)
}


export function* getBlockByHeight(action: ReturnType<typeof actions.getBlock>) {
  try {
    const res = yield call(withLoading, api.getBlockByHeight, action.type, action.payload);
    yield put(actions.setBlock(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetBlockByHeight() {
  yield takeLatest(types.GET_BLOCK_BY_HEIGHT, getBlockByHeight)
}

export function* getBlockList(action: ReturnType<typeof actions.getBlockList>) {
  try {
    const res = yield call(withLoading, api.getBlockList, action.type, action.payload);
    yield put(actions.setBlockList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      yield put(actions.setBlockList([]));
    }
  } finally {
    yield put(actions.getBlockListInDelay(action.payload));
  }
}

function* watchGetBlockList() {
  yield takeLatest(types.GET_BLOCK_LIST, getBlockList)
}

export function* getBlockListInDelay(action: ReturnType<typeof actions.getBlockList>) {
  const url = window.location.href;
  if (action.payload.page === 1 && (url.endsWith('/') || url.endsWith('/blocks') || url.endsWith('/blocks/1'))) {
    yield delay(POLLING_INTERVAL);
    yield fork(getBlockList, actions.getBlockList(action.payload));
  }
}

function* watchGetBlockListInDelay() {
  yield takeLatest(types.GET_BLOCK_LIST_IN_DELAY, getBlockListInDelay)
}

const sagas = [
  watchGetBlock,
  watchGetBlockByHeight,
  watchGetBlockList,
  watchGetBlockListInDelay
];

export default sagas;