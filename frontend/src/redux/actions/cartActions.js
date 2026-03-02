// src/redux/actions/cartActions.js

import API from '../../axios'
import { toast } from 'react-toastify'

import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
} from '../constants/cartConstants'

// =======================
// ADD TO CART
// =======================
export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await API.get(`/products/${id}`)

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty,
      },
    })

    localStorage.setItem(
      'cartItems',
      JSON.stringify(getState().cart.cartItems)
    )

    toast.success('Item added to cart 🛒')
  } catch (error) {
    toast.error('Failed to add item')
  }
}

// =======================
// REMOVE SINGLE ITEM
// =======================
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  localStorage.setItem(
    'cartItems',
    JSON.stringify(getState().cart.cartItems)
  )

  toast.info('Item removed')
}

// =======================
// CLEAR ENTIRE CART
// =======================
export const clearCart = () => (dispatch) => {
  dispatch({ type: CART_CLEAR_ITEMS })
  localStorage.removeItem('cartItems')

  toast.warn('Cart cleared')
}

// =======================
// SAVE SHIPPING
// =======================
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

// =======================
// SAVE PAYMENT
// =======================
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}