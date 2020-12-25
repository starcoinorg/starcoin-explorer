import { put, call, all } from 'redux-saga/effects';

function* withLoading(func: any, type: any, params: any) {
  try {
    yield(put({ type: `${type}_REQUEST`}));
    let response;
    if (typeof func === 'function') {
      response = yield call(func, params);
    } else {
      response = yield all(func.map((obj: any) => (call as any)(...obj)));
    }
    yield put({ type: `${type}_SUCCESS`});
    return response;
  } catch (error) {
    yield(put({ type: `${type}_FAILURE` }));
    throw error;
  }
}

export default withLoading as any;