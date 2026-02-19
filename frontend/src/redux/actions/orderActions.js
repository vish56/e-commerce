import API from '../../axios'
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

  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,

  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
} from '../constants/orderConstants'

// =======================
// CREATE ORDER
// =======================
export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    if (!userInfo || !userInfo.access) {
      throw new Error('Not authenticated')
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.access}`,
      },
    }

    const { data } = await API.post('orders/add/', order, config)

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    })
  }
}

// =======================
// GET ORDER DETAILS
// =======================
export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    if (!userInfo || !userInfo.access) {
      throw new Error('Not authenticated')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
      },
    }

    const { data } = await API.get(`orders/${id}/`, config)

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    })
  }
}

// =======================
// LIST ORDERS (ADMIN)
// =======================
export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    if (!userInfo || !userInfo.access) {
      throw new Error('Not authenticated')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
      },
    }

    const { data } = await API.get('orders/', config)

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    })
  }
}

// =======================
// MARK ORDER AS PAID
// =======================
export const payOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    if (!userInfo || !userInfo.access) {
      throw new Error('Not authenticated')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
      },
    }

    await API.put(`orders/${orderId}/pay/`, {}, config)

    dispatch({ type: ORDER_PAY_SUCCESS })
  } catch (error) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    })
  }
}

// =======================
// MARK ORDER AS DELIVERED (ADMIN)
// =======================
export const deliverOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DELIVER_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    if (!userInfo || !userInfo.access) {
      throw new Error('Not authenticated')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
      },
    }

    await API.put(`orders/${orderId}/deliver/`, {}, config)

    dispatch({ type: ORDER_DELIVER_SUCCESS })
  } catch (error) {
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    })
  }
}
