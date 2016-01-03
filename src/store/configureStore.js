import { compose, createStore } from 'redux'
import rootReducer from '../reducers'
import persistState from 'redux-localstorage'

const createPersistentStore = compose(
  persistState()
)(createStore)

export default function configureStore(initialState) {
  const store = createPersistentStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
