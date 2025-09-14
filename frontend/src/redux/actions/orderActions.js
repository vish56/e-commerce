// src/redux/actions/orderActions.js
import API from '../../axios' // use your axios instance (src/axios.js)
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
} from '../constants/orderConstants'

// Create Order
export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    if (!userInfo) {
      throw new Error('Not authenticated — please login before placing an order.')
    }

    // pick token from multiple possible keys (robust)
    const token = userInfo?.access || userInfo?.token || userInfo?.authToken
    console.log('DEBUG createOrder userInfo present:', !!userInfo, 'token present:', !!token)

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }

    // API.defaults.baseURL handles base; call relative path
    console.log('DEBUG POST to', (API.defaults.baseURL || '') + 'orders/add/', 'payload=', order)
    const { data } = await API.post('orders/add/', order, config)

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    console.error('DEBUG createOrder error:', error.response?.data || error.message)
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    })
  }
}

// Get Order Details
export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    if (!userInfo) {
      throw new Error('Not authenticated')
    }

    const token = userInfo?.access || userInfo?.token || userInfo?.authToken
    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }

    const { data } = await API.get(`orders/${id}/`, config)

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    console.error('DEBUG getOrderDetails error:', error.response?.data || error.message)
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    })
  }
}

// Admin: Get all Orders
export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    if (!userInfo) {
      throw new Error('Not authenticated')
    }

    const token = userInfo?.access || userInfo?.token || userInfo?.authToken
    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }

    const { data } = await API.get('orders/', config)

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    console.error('DEBUG listOrders error:', error.response?.data || error.message)
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    })
  }
}
