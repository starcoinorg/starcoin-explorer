import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware  from 'redux-saga';
import createRootReducer from './reducers';
import rootSaga from './sagas';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
    routerMiddleware(history),
    sagaMiddleware
];

const composeEnhancers = process.env.NODE_ENV === 'production' ? compose : (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);

const store = createStore(
    createRootReducer(history),
    composeEnhancers(applyMiddleware(...middlewares))
);

declare global{
    interface Window {
        store: any;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

if (process.env.NODE_ENV === 'development') {
    window.store = store;
}

sagaMiddleware.run(rootSaga);
export default store;