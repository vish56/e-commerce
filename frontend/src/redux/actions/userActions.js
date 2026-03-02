// src/redux/actions/userActions.js

import API from '../../axios'
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
} from '../constants/userConstants'

import { CART_RESET } from '../constants/cartConstants'

// =======================
// LOGIN
// =======================
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST })

    const { data } = await API.post('users/login/', {
      email: email.trim(),
      password,
    })

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response?.data?.detail || 'Invalid email or password',
    })
  }
}

// =======================
// LOGOUT
// =======================
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('cartItems')
  localStorage.removeItem('shippingAddress')
  localStorage.removeItem('paymentMethod')

  dispatch({ type: USER_LOGOUT })
  dispatch({ type: CART_RESET })
  dispatch({ type: USER_LIST_RESET })
}

// =======================
// REGISTER
// =======================
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST })

    const { data } = await API.post('users/register/', {
      name,
      email: email.trim(),
      password,
    })

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    })

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response?.data?.detail || 'User already exists',
    })
  }
}

// =======================
// LIST USERS (ADMIN)
// =======================
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
      },
    }

    const { data } = await API.get('users/', config)

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    })
  }
}