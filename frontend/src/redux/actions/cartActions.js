import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants'
import API from '../../axios'

// helper: persist cart data consistently
const saveCartToStorage = (getState) => {
  try {
    const { cart } = getState()
    localStorage.setItem('cartItems', JSON.stringify(cart.cartItems || []))
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify(cart.shippingAddress || {})
    )
    localStorage.setItem(
      'paymentMethod',
      JSON.stringify(cart.paymentMethod || '')
    )
  } catch (e) {
    console.error('Failed to save cart to localStorage', e)
  }
}

// Add item to cart
export const addToCart = (id, qty = 1) => async (dispatch, getState) => {
  // ✅ use centralized API instance + trailing slash
  const { data } = await API.get(`products/${id}/`)

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data.id, // Django uses `id`
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  })

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
