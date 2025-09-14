// src/redux/actions/cartActions.js
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  // CART_CLEAR_ITEMS,
} from '../constants/cartConstants'
import axios from 'axios'

// helper: persist cart data consistently
const saveCartToStorage = (getState) => {
  try {
    const { cart } = getState()
    // Persist cartItems array
    localStorage.setItem('cartItems', JSON.stringify(cart.cartItems || []))
    // Persist shippingAddress object
    localStorage.setItem('shippingAddress', JSON.stringify(cart.shippingAddress || {}))
    // Persist paymentMethod as JSON string
    localStorage.setItem('paymentMethod', JSON.stringify(cart.paymentMethod || ''))
  } catch (e) {
    console.error('Failed to save cart to localStorage', e)
  }
}

// Add item to cart
export const addToCart = (id, qty = 1) => async (dispatch, getState) => {
  // Ensure we call the correct Django API endpoint with trailing slash
  const { data } = await axios.get(`/api/products/${id}/`)

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      // normalize id (backend might use id or _id)
      product: data.id || data._id || id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  })

  // persist the updated cart to localStorage
  saveCartToStorage(getState)
}

// Remove item from cart
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  saveCartToStorage(getState)
}

// Save shipping address
export const saveShippingAddress = (data) => (dispatch, getState) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  saveCartToStorage(getState)
}

// Save payment method
export const savePaymentMethod = (data) => (dispatch, getState) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  saveCartToStorage(getState)
}
