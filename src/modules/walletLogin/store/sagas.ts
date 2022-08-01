import { call, put, takeLatest, delay, fork, select } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as apis from './apis';
import * as actions from './actions';
import * as types from './constants';
import { POLLING_INTERVAL } from '@/utils/constants';
import { checkStarMaskInstalled, connectStarMask, createStcProvider, getSign, getStarMaskInstallUrl, getSTCAccountBalance } from '../../../wallet/starMask';
import Cookies from 'js-cookie'

const signJson = {
  1: "STCSCAN_LOGIN_CODE",
  2: "STCSCAN_UPDATE_ADDR_CODE",
  3: "STCSCAN_DESTROY_ADDR_CODE"
}
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
    yield put(actions.setAccounts(accounts));
    const isStarMaskConnected = accounts && accounts.length > 0;
    if (isStarMaskConnected) {
      const stcProvider = yield call(createStcProvider);
      yield put(actions.setProvider(stcProvider));
      if (!stcProvider) {
        throw ('no provider')
      }
      if (action?.payload) {
        try {
          const code = yield call(apis.getQrCode, { address: accounts[0], opt: 1 });
          if (code.status == '200') {
            const sign = yield call(getSign, accounts[0], `${signJson[1]}:${code.data}`, 1);
            const res = yield call(withLoading, apis.login, types.CONNECTWALLET, { address: accounts[0], sign: sign });
            if (!res || res.status !== "200") {
              throw ('login error')
            }
          } else {
            throw ('code error')
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
  let connectStatus = Cookies.get('wallet_status');
  if (connectStatus) {
    yield fork(connectWallet);
  }
}

function* watchInit() {
  yield takeLatest(types.WALLETINIT, walletInit);
}


export function* deleteUserInfo({ callback }: any): any {
  const state = yield select();
  const code = yield call(apis.getQrCode, { address: state[types.SCOPENAME].accounts[0], opt: 3 });
  if (code.status == '200') {
    const sign = yield call(getSign, state[types.SCOPENAME].accounts[0], `${signJson[3]}:${code.data}`, 1);
    const res = yield call(apis.deleteUserInfo, { address: state[types.SCOPENAME].accounts[0], sign });
    if (res.status == '200') {
      setTimeout(()=>{
        window.location.href = '/'
      },1000)
    }
    callback(res)
  }

}

function* watchDeleteUserInfo() {
  yield takeLatest(types.DELETE_USERINFO, deleteUserInfo);
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
export function* updateUserInfo({ payload, callback }: any): any {
  const state = yield select();
  const res = yield call(apis.updateUserInfo, { address: state[types.SCOPENAME].accounts[0], ...payload });
  callback(res);
  yield fork(getUserInfo);
}

function* watchUpdateUserInfo() {
  yield takeLatest(types.UPDATE_USERINFO, updateUserInfo);
}


const sagas = [
  watchConnect,
  watchLogout,
  watchBalance,
  watchInit,
  watchUserInfo,
  watchUpdateUserInfo,
  watchDeleteUserInfo
];

export default sagas;