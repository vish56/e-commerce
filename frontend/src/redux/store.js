// src/redux/store.js

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

// USER REDUCERS
import {
  userLoginReducer,
  userRegisterReducer,
  userListReducer,
} from './reducers/userReducers'

// PRODUCT REDUCERS
import {
  productListReducer,
  productDetailsReducer,
  productTopRatedReducer,
} from './reducers/productReducers'

// CART REDUCER
import { cartReducer } from './reducers/cartReducers'

// ORDER REDUCERS
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderListReducer,
  orderPayReducer,
  orderDeliverReducer,
} from './reducers/orderReducers'

// =======================
// COMBINE REDUCERS
// =======================
const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userList: userListReducer, // ✅ FIX ADDED

  productList: productListReducer,
  productDetails: productDetailsReducer,
  productTopRated: productTopRatedReducer,

  cart: cartReducer,

  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderList: orderListReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
})

// =======================
// LOCAL STORAGE INIT
// =======================
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : ''

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
}

// =======================
// STORE
// =======================
const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store