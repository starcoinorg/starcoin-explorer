import { call, put, takeLatest, delay, fork } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as api from './apis';
import * as actions from './actions';
import * as types from './constants';
import { POLLING_INTERVAL } from '@/utils/constants';

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
  yield takeLatest(types.GET_BLOCK, getBlock);
}

export function* getUncleBlock(action: ReturnType<typeof actions.getUncleBlock>) {
  try {
    const res = yield call(withLoading, api.getUncleBlock, action.type, action.payload);
    yield put(actions.setUncleBlock(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetUncleBlock() {
  yield takeLatest(types.GET_UNCLE_BLOCK, getUncleBlock);
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
  yield takeLatest(types.GET_BLOCK_BY_HEIGHT, getBlockByHeight);
}

export function* getUncleBlockByHeight(action: ReturnType<typeof actions.getUncleBlock>) {
  try {
    const res = yield call(withLoading, api.getUncleBlockByHeight, action.type, action.payload);
    yield put(actions.setUncleBlock(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetUncleBlockByHeight() {
  yield takeLatest(types.GET_UNCLE_BLOCK_BY_HEIGHT, getUncleBlockByHeight);
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

export function* getUncleBlockList(action: ReturnType<typeof actions.getUncleBlockList>) {
  try {
    const res = yield call(withLoading, api.getUncleBlockList, action.type, action.payload);
    yield put(actions.setUncleBlockList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      yield put(actions.setUncleBlockList([]));
    }
  } finally {
    yield put(actions.getUncleBlockListInDelay(action.payload));
  }
}

function* watchGetBlockList() {
  yield takeLatest(types.GET_BLOCK_LIST, getBlockList);
}

function* watchGetUncleBlockList() {
  yield takeLatest(types.GET_UNCLE_BLOCK_LIST, getUncleBlockList);
}

export function* getBlockListInDelay(action: ReturnType<typeof actions.getBlockList>) {
  const url = window.location.href;
  if (action.payload.page === 1 && (url.endsWith('/') || url.endsWith('/blocks') || url.endsWith('/blocks/1'))) {
    yield delay(POLLING_INTERVAL);
    yield fork(getBlockList, actions.getBlockList(action.payload));
  }
}

export function* getUncleBlockListInDelay(action: ReturnType<typeof actions.getUncleBlockList>) {
  const url = window.location.href;
  if (action.payload.page === 1 && (url.endsWith('/') || url.endsWith('/blocks') || url.endsWith('/blocks/1') || url.endsWith('/uncles/1'))) {
    yield delay(POLLING_INTERVAL);
    yield fork(getUncleBlockList, actions.getUncleBlockList(action.payload));
  }
}

function* watchGetBlockListInDelay() {
  yield takeLatest(types.GET_BLOCK_LIST_IN_DELAY, getBlockListInDelay);
}

function* watchGetUncleBlockListInDelay() {
  yield takeLatest(types.GET_UNCLE_BLOCK_LIST_IN_DELAY, getUncleBlockListInDelay);
}

const sagas = [
  watchGetBlock,
  watchGetUncleBlock,
  watchGetBlockByHeight,
  watchGetUncleBlockByHeight,
  watchGetBlockList,
  watchGetBlockListInDelay,
  watchGetUncleBlockList,
  watchGetUncleBlockListInDelay,
];

export default sagas;