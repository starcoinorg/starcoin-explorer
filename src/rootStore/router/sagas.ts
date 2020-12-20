import { push, goBack } from 'connected-react-router';
import { put, takeEvery } from 'redux-saga/effects';
import { withBaseRoute } from '@/utils/helper';

export function* pushLocation({ params }: any) {
    const route = params.abs ? params.path : withBaseRoute(params.path);
    yield put(push(route));
}

function* watchPushLocation() {
    yield takeEvery('PUSH_LOCATION', pushLocation);
}

export function* goBackLocation() {
    yield put(goBack())
}

function* watchGoBackLocation() {
    yield takeEvery('GO_BACK', goBackLocation);
}

const sagas = [
    watchPushLocation,
    watchGoBackLocation
];

export default sagas;
