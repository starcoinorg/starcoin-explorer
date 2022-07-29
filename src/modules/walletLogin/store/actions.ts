import * as types from './constants';

export function getAccounts(payload: any) {
  return {
    type: types.GET_ACCOUNTS,
    payload,
  };
}

export function setAccounts(payload: any) {
  return {
    type: types.SET_ACCOUNTS,
    payload,
  };
}

export function getBalance(payload: any) {
  return {
    type: types.GET_BALANCE,
    payload,
  };
}

// export function connectWallet(payload: any) {
//   return {
//     type: types.CONNECTWALLET,
//     payload,
//   };
// }

// export function logout(payload: any) {
//   return {
//     type: types.LOGOUT,
//     payload,
//   };
// }

export function setBalance(payload: any) {
  return {
    type: types.SET_BALANCE,
    payload,
  };
}

export function getState(payload: any) {
  return {
    type: types.GET_STATE, 
    payload,
  };
}

export function setState(payload: any) {
  payload?localStorage.setItem('wallet_status', payload):localStorage.removeItem('wallet_status');
  return {
    type: types.SET_STATE,
    payload,
  };
}

export function getSignResult(payload: any) {
  return {
    type: types.GET_SIGNRESULT,
    payload,
  };
}

export function setSignResult(payload: any) {
  return {
    type: types.SET_SIGNRESULT,
    payload,
  };
}

export function getChainId(payload: any) {
  return {
    type: types.GET_CHAINID,
    payload,
  };
}

export function setProvider(payload: any) {
  return {
    type: types.SET_PROVIDER,
    payload,
  };
}

export function setUserInfo(payload: any) {
  return {
    type: types.SET_USERINFO_DATA,
    payload,
  };
}