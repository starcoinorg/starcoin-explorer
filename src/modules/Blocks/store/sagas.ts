import { call, put, takeLatest, take, fork, cancel, cancelled, delay } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as api from './apis';
import * as actions from './actions';
import * as types from './constants';

const blockPollingInterval = 5000;

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
  }
}

function* blockPolling(action: ReturnType<typeof actions.getBlockList>) {
  try {
    while (true) {
      yield getBlockList(action)
      yield delay(blockPollingInterval)
    }
  } finally {
    if (yield cancelled()) {
      console.log('block polling stopped')
    }
  }
}

export function* blockPollingManager() {
  let action, pollingTask: any;
  console.log(`initial value block pollingTask: ${pollingTask}`);
  while (action = yield take(types.GET_BLOCK_LIST)) {
    console.log(action);
    if (pollingTask) {
      yield cancel(pollingTask);
    }
    const { page } = action.payload;
    if (page === 1) {
      console.log('startted block polling');
      pollingTask = yield fork(blockPolling, action);
    } else {
      yield getBlockList(action)
    }
  }
}

const sagas = [
  watchGetBlock,
  watchGetBlockByHeight,
  blockPollingManager
];

export default sagas;