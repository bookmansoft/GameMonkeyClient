var redux;
(function (redux) {
    var applyMiddleware = (function () {
        function applyMiddleware() {
            for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
            middlewares[_key] = arguments[_key];
            }

            return function (createStore) {
                return function (reducer, preloadedState, enhancer) {
                    var store = createStore(reducer, preloadedState, enhancer);
                    var _dispatch = store.dispatch;
                    var chain = [];

                    var middlewareAPI = {
                    getState: store.getState,
                    dispatch: function dispatch(action) {
                        return _dispatch(action);
                    }
                    };
                    chain = middlewares.map(function (middleware) {
                        return middleware(middlewareAPI);
                    });
                    _dispatch = _compose2.apply(undefined, chain)(store.dispatch);

                    return _extends({}, store, {
                        dispatch: _dispatch
                    });
                };
            };
        }
        return applyMiddleware;
    })();
    redux.applyMiddleware = applyMiddleware;    
})(redux || (redux = {}));

(function (redux) {
    var bindActionCreators = (function () {
        function bindActionCreators(actionCreators, dispatch) {
            if (typeof actionCreators === 'function') {
            return bindActionCreator(actionCreators, dispatch);
            }

            if (typeof actionCreators !== 'object' || actionCreators === null) {
            throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
            }

            var keys = Object.keys(actionCreators);
            var boundActionCreators = {};
            for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var actionCreator = actionCreators[key];
            if (typeof actionCreator === 'function') {
                boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
            }
            }
            return boundActionCreators;
        }
        return bindActionCreators;
    })();
    redux.bindActionCreators = bindActionCreators;    
})(redux || (redux = {}));

(function (redux) {
    var combineReducers = (function () {
        function combineReducers(reducers) {
            var reducerKeys = Object.keys(reducers);
            var finalReducers = {};
            for (var i = 0; i < reducerKeys.length; i++) {
            var key = reducerKeys[i];

            if (true) {
                if (typeof reducers[key] === 'undefined') {
                    warning('No reducer provided for key "' + key + '"');
                }
            }

            if (typeof reducers[key] === 'function') {
                finalReducers[key] = reducers[key];
            }
            }
            var finalReducerKeys = Object.keys(finalReducers);

            if (true) {
            var unexpectedKeyCache = {};
            }

            var sanityError;
            try {
            assertReducerSanity(finalReducers);
            } catch (e) {
            sanityError = e;
            }

            return function combination() {
            var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var action = arguments[1];

            if (sanityError) {
                throw sanityError;
            }

            if (true) {
                var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
                if (warningMessage) {
                warning(warningMessage);
                }
            }

            var hasChanged = false;
            var nextState = {};
            for (var i = 0; i < finalReducerKeys.length; i++) {
                var key = finalReducerKeys[i];
                var reducer = finalReducers[key];
                var previousStateForKey = state[key];
                var nextStateForKey = reducer(previousStateForKey, action);
                if (typeof nextStateForKey === 'undefined') {
                var errorMessage = getUndefinedStateErrorMessage(key, action);
                throw new Error(errorMessage);
                }
                nextState[key] = nextStateForKey;
                hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
            }
            return hasChanged ? nextState : state;
            };
        }
        return combineReducers;
    })();
    redux.combineReducers = combineReducers;    
})(redux || (redux = {}));

(function (redux) {
    var compose = (function () {
        function compose() {
            for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
            funcs[_key] = arguments[_key];
            }

            if (funcs.length === 0) {
            return function (arg) {
                return arg;
            };
            }

            if (funcs.length === 1) {
            return funcs[0];
            }

            var last = funcs[funcs.length - 1];
            var rest = funcs.slice(0, -1);
            return function () {
            return rest.reduceRight(function (composed, f) {
                return f(composed);
            }, last.apply(undefined, arguments));
            };
        }
        return compose;
    })();
    redux.compose = compose;    
})(redux || (redux = {}));

(function (redux) {
    var Observer = (function () {
        return Observer;
    })();
    redux.Observer = Observer;    
})(redux || (redux = {}));

(function (redux) {
    var createStore = (function () {
        function createStore(reducer, preloadedState, enhancer) {
            var _ref2;

            if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
            enhancer = preloadedState;
            preloadedState = undefined;
            }

            if (typeof enhancer !== 'undefined') {
            if (typeof enhancer !== 'function') {
                throw new Error('Expected the enhancer to be a function.');
            }

            return enhancer(createStore)(reducer, preloadedState);
            }

            if (typeof reducer !== 'function') {
            throw new Error('Expected the reducer to be a function.');
            }

            var currentReducer = reducer;
            var currentState = preloadedState;
            var currentListeners = [];
            var nextListeners = currentListeners;
            var isDispatching = false;

            function ensureCanMutateNextListeners() {
            if (nextListeners === currentListeners) {
                nextListeners = currentListeners.slice();
            }
            }

            /**
             * Reads the state tree managed by the store.
             *
             * @returns {any} The current state tree of your application.
             */
            function getState() {
            return currentState;
            }

            /**
             * Adds a change listener. It will be called any time an action is dispatched,
             * and some part of the state tree may potentially have changed. You may then
             * call `getState()` to read the current state tree inside the callback.
             *
             * You may call `dispatch()` from a change listener, with the following
             * caveats:
             *
             * 1. The subscriptions are snapshotted just before every `dispatch()` call.
             * If you subscribe or unsubscribe while the listeners are being invoked, this
             * will not have any effect on the `dispatch()` that is currently in progress.
             * However, the next `dispatch()` call, whether nested or not, will use a more
             * recent snapshot of the subscription list.
             *
             * 2. The listener should not expect to see all state changes, as the state
             * might have been updated multiple times during a nested `dispatch()` before
             * the listener is called. It is, however, guaranteed that all subscribers
             * registered before the `dispatch()` started will be called with the latest
             * state by the time it exits.
             *
             * @param {Function} listener A callback to be invoked on every dispatch.
             * @returns {Function} A function to remove this change listener.
             */
            function subscribe(listener) {
            if (typeof listener !== 'function') {
                throw new Error('Expected listener to be a function.');
            }

            var isSubscribed = true;

            ensureCanMutateNextListeners();
            nextListeners.push(listener);

            return function unsubscribe() {
                if (!isSubscribed) {
                return;
                }

                isSubscribed = false;

                ensureCanMutateNextListeners();
                var index = nextListeners.indexOf(listener);
                nextListeners.splice(index, 1);
            };
            }

            /**
             * Dispatches an action. It is the only way to trigger a state change.
             *
             * The `reducer` function, used to create the store, will be called with the
             * current state tree and the given `action`. Its return value will
             * be considered the **next** state of the tree, and the change listeners
             * will be notified.
             *
             * The base implementation only supports plain object actions. If you want to
             * dispatch a Promise, an Observable, a thunk, or something else, you need to
             * wrap your store creating function into the corresponding middleware. For
             * example, see the documentation for the `redux-thunk` package. Even the
             * middleware will eventually dispatch plain object actions using this method.
             *
             * @param {Object} action A plain object representing “what changed”. It is
             * a good idea to keep actions serializable so you can record and replay user
             * sessions, or use the time travelling `redux-devtools`. An action must have
             * a `type` property which may not be `undefined`. It is a good idea to use
             * string constants for action types.
             *
             * @returns {Object} For convenience, the same action object you dispatched.
             *
             * Note that, if you use a custom middleware, it may wrap `dispatch()` to
             * return something else (for example, a Promise you can await).
             */
            function dispatch(action) {
            if (!_isPlainObject(action)) {
                throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
            }

            if (typeof action.type === 'undefined') {
                throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
            }

            if (isDispatching) {
                throw new Error('Reducers may not dispatch actions.');
            }

            try {
                isDispatching = true;
                currentState = currentReducer(currentState, action);
            } finally {
                isDispatching = false;
            }

            var listeners = currentListeners = nextListeners;
            for (var i = 0; i < listeners.length; i++) {
                listeners[i]();
            }

            return action;
            }

            /**
             * Replaces the reducer currently used by the store to calculate the state.
             *
             * You might need this if your app implements code splitting and you want to
             * load some of the reducers dynamically. You might also need this if you
             * implement a hot reloading mechanism for Redux.
             *
             * @param {Function} nextReducer The reducer for the store to use instead.
             * @returns {void}
             */
            function replaceReducer(nextReducer) {
            if (typeof nextReducer !== 'function') {
                throw new Error('Expected the nextReducer to be a function.');
            }

            currentReducer = nextReducer;
            dispatch({ type: ActionTypes.INIT });
            }

            /**
             * Interoperability point for observable/reactive libraries.
             * @returns {observable} A minimal observable of state changes.
             * For more information, see the observable proposal:
             * https://github.com/zenparsing/es-observable
             */
            function observable() {
                var _ref;

                var outerSubscribe = subscribe;
                return _ref = {
                    /**
                     * The minimal observable subscription method.
                     * @param {Object} observer Any object that can be used as an observer.
                     * The observer object should have a `next` method.
                     * @returns {subscription} An object with an `unsubscribe` method that can
                     * be used to unsubscribe the observable from the store, and prevent further
                     * emission of values from the observable.
                     */
                    subscribe: function subscribe(observer) {
                    if (typeof observer !== 'object') {
                        throw new TypeError('Expected the observer to be an object.');
                    }

                    function observeState() {
                        if (observer.next) {
                        observer.next(getState());
                        }
                    }

                    observeState();
                    var unsubscribe = outerSubscribe(observeState);
                    return { unsubscribe: unsubscribe };
                    }
                },
                _ref[symbolObservablePonyfill(root)] = function () {
                    return this;
                }, 
                _ref;
            }

            // When a store is created, an "INIT" action is dispatched so that every
            // reducer returns their initial state. This effectively populates
            // the initial state tree.
            dispatch({ type: ActionTypes.INIT });

            return _ref2 = {
            dispatch: dispatch,
            subscribe: subscribe,
            getState: getState,
            replaceReducer: replaceReducer
            }, _ref2[symbolObservablePonyfill(root)] = observable, _ref2;
        }
        return createStore;
    })();
    redux.createStore = createStore;    
})(redux || (redux = {}));

function bindActionCreator(actionCreator, dispatch) {
    return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
    };
}

function getUndefinedStateErrorMessage(key, action) {
    var actionType = action && action.type;
    var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

    return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
    var reducerKeys = Object.keys(reducers);
    var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

    if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
    }

    if (!_isPlainObject(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
    }

    var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
    });

    unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
    });

    if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
    }
}

function assertReducerSanity(reducers) {
    Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
        throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
        throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
    });
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error(message);
    }
    /* eslint-enable no-console */
    try {
        // This error was thrown as a convenience so that if you enable
        // "break on all exceptions" in your console,
        // it would pause the execution at this line.
        throw new Error(message);
        /* eslint-disable no-empty */
    } catch (e) {}
    /* eslint-enable no-empty */
}


function symbolObservablePonyfill(root) {
    var result;
    var _Symbol = root.Symbol;

    if (typeof _Symbol === 'function') {
        if (_Symbol.observable) {
            result = _Symbol.observable;
        } else {
            result = _Symbol('observable');
            _Symbol.observable = result;
        }
    } else {
        result = '@@observable';
    }

    return result;
};

var ActionTypes = {
    INIT: '@@redux/INIT'
};

var _isPlainObject = function (o) {
    return o && toString.call(o) === '[object Object]' && 'isPrototypeOf' in o;
};

var root = undefined; /* global window */
if (typeof global !== 'undefined') {
    root = global;
} else if (typeof window !== 'undefined') {
    root = window;
};

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _compose2() {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
    }

    if (funcs.length === 0) {
    return function (arg) {
        return arg;
    };
    } else {
    var _ret = function () {
        var last = funcs[funcs.length - 1];
        var rest = funcs.slice(0, -1);
        return {
        v: function v() {
            return rest.reduceRight(function (composed, f) {
            return f(composed);
            }, last.apply(undefined, arguments));
        }
        };
    }();

    if (typeof _ret === "object") return _ret.v;
    }
}

/**
 * Mixin使用.
 * 
 * 随着传统的面向对象的层次结构，从可重用的组件建立类的另一种流行的方式是通过简单的组合部分类来构建他们。
 * 你可能熟悉混入或性状比如Scala语言的理念，模式也达到了JavaScript的一些社区人气 
 */
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

// var Disposable = (function () {
//     function Disposable() {
//     }
//     Disposable.prototype.dispose = function () {
//         this.isDisposed = true;
//     };
//     return Disposable;
// })();

// var Activatable = (function () {
//     function Activatable() {
//     }
//     Activatable.prototype.activate = function () {
//         this.isActive = true;
//     };
//     Activatable.prototype.deactivate = function () {
//         this.isActive = false;
//     };
//     return Activatable;
// })();

// //SmartObject类实现Disposable与Activatable类
// var SmartObject = (function () {
//     function SmartObject() {
//         var _this = this;
//         // Disposable
//         this.isDisposed = false;
//         // Activatable
//         this.isActive = false;
//         setInterval(function () { return console.log(_this.isActive + " : " + _this.isDisposed); }, 500);
//     }
//     //相互作用
//     SmartObject.prototype.interact = function () {
//         this.activate();
//     };
//     return SmartObject;
// })();

// applyMixins(SmartObject, [Disposable, Activatable]);

//测试用例
//var smartObj = new SmartObject();
//setTimeout(function () { return smartObj.interact(); }, 1000);
