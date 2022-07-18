import { call, put, takeLatest, delay, fork, select } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as apis from './apis';
import * as actions from './actions';
import * as types from './constants';
import { POLLING_INTERVAL } from '@/utils/constants';
import { checkStarMaskInstalled, connectStarMask, createStcProvider, getSign, getStarMaskInstallUrl, getSTCAccountBalance } from '../../../wallet/starMask';


export function* connectWallet(action?: any): any {

  const isStalled = checkStarMaskInstalled();
  if (!isStalled) {
    window.open(getStarMaskInstallUrl())
    return;
  }
  const state = yield select();
  if (isStalled && state[types.SCOPENAME].connectState) {
    return;
  }
  try {
    const accounts = yield call(connectStarMask);
    const sign = yield call(getSign, accounts[0], 1)
    yield put(actions.setAccounts(accounts));
    yield put(actions.setSignResult(sign));
    const isStarMaskConnected = accounts && accounts.length > 0;
    if (isStarMaskConnected) {
      const stcProvider = yield call(createStcProvider);
      yield put(actions.setProvider(stcProvider));
      if (!stcProvider) {
        throw ('no provider')
      }
      if (action?.payload) {
        try {
          const res = yield call(withLoading, apis.login, types.CONNECTWALLET, { address: accounts[0], sign: sign });
          if (!res || res.status !== "200") {
            throw ('login error')
          }
        } catch (error) { }
      }
      yield put(actions.setState('stc'));
      yield fork(getBalance);
      yield fork(getUserInfo);
    }
    window.starcoin &&
      window.starcoin.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length <= 0) {
          actions.setState(null)
        }
        window.location.reload();
      });
    window.starcoin &&
      window.starcoin.on("chainChanged", () => {
        window.location.reload();
      });
  } catch (error) {
    yield put(actions.setState(null));
    console.log(error)
  }
}

function* watchConnect() {
  yield takeLatest(types.CONNECTWALLET, connectWallet);
}

export function* getUserInfo(): any {
  try {
    const state = yield select();
    const res = yield call(apis.getUserInfo, { address: state[types.SCOPENAME].accounts[0] });
    if (res.status === '200') {
      yield put(actions.setUserInfo(res.data || {}));
      yield put(actions.setState('stc'));
    }
  } catch (error) {
    console.log(error)
  }
}

function* watchUserInfo() {
  yield takeLatest(types.SET_USERINFO, getUserInfo);
}

export function* walletInit() {
  let connectStatus = localStorage.getItem('wallet_status');
  if (connectStatus) {
    yield fork(connectWallet);
  }
}

function* watchInit() {
  yield takeLatest(types.WALLETINIT, walletInit);
}

export function* updateUserInfo({ payload, callback }: any): any {
  const state = yield select();
  const res = yield call(apis.updateUserInfo, { address: state[types.SCOPENAME].accounts[0], ...payload });
  callback(res)
}

function* watchUpdateUserInfo() {
  yield takeLatest(types.UPDATE_USERINFO, updateUserInfo);
}

export function* logout({ callback }: any): any {
  const state = yield select();
  const res = yield call(withLoading, apis.logout, types.LOGOUT, { address: state[types.SCOPENAME].accounts[0] });
  if (res.status === '200') {
    yield put(actions.setState(null));
  }
  callback(res)
}

function* watchLogout() {
  yield takeLatest(types.LOGOUT, logout);
}

export function* getBalance(): any {
  const state = yield select();
  const balance = yield call(getSTCAccountBalance, state[types.SCOPENAME].stcProvider, state[types.SCOPENAME].accounts[0]);
  yield put(actions.setBalance(balance));
  yield delay(POLLING_INTERVAL);
  yield fork(getBalance);
}

function* watchBalance() {
  yield takeLatest(types.GET_BALANCE_DELAY, getBalance);
}

const sagas = [
  watchConnect,
  watchLogout,
  watchBalance,
  watchInit,
  watchUserInfo,
  watchUpdateUserInfo
];

export default sagas;