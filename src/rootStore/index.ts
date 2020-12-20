import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware  from 'redux-saga';
import ReactGA from 'react-ga';
import createRootReducer from './reducers';
import rootSaga from './sagas';

export const history = createBrowserHistory();

history.listen(() => {
    ReactGA.pageview(window.location.href);
});

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
    routerMiddleware(history),
    sagaMiddleware
];

// const composeEnhancers = process.env.NODE_ENV === 'production' ? compose : (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);
const composeEnhancers = compose;

const store = createStore(
    createRootReducer(history),
    composeEnhancers(applyMiddleware(...middlewares))
);

// if (process.env.NODE_ENV === 'development') {
//     window.store = store;
// }

sagaMiddleware.run(rootSaga);
export default store;