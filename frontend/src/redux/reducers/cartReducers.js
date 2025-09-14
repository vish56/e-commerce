import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
} from '../constants/cartConstants'

// initialize state from localStorage if present (keeps shape consistent)
const cartItemsFromStorage = (() => {
  try {
    return JSON.parse(localStorage.getItem('cartItems') || '[]')
  } catch (e) {
    return []
  }
})()

const shippingAddressFromStorage = (() => {
  try {
    return JSON.parse(localStorage.getItem('shippingAddress') || '{}')
  } catch (e) {
    return {}
  }
})()

const paymentMethodFromStorage = (() => {
  try {
    // we store paymentMethod as JSON.stringify(value) in actions
    const raw = localStorage.getItem('paymentMethod')
    return raw ? JSON.parse(raw) : ''
  } catch (e) {
    return ''
  }
})()

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage,
}

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload
      const existItem = state.cartItems.find((x) => x.product === item.product)

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      }

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      }

    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      }

    case CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
      }

    default:
      return state
  }
}
