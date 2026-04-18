import axios from 'axios'
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
} from '../constants/productConstants'

// Helper for auth config
const getConfig = (getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo?.access || ''}`,
    },
  }
}

// =======================
// LIST PRODUCTS
// =======================
export const listProducts =
  (keyword = '', pageNumber = 1, sort = '') =>
  async (dispatch, getState) => {
    try {
      const { productList } = getState()

      // Basic caching (avoid duplicate calls)
      if (
        productList.products.length > 0 &&
        !keyword &&
        pageNumber === 1 &&
        !sort
      ) {
        return
      }

      dispatch({ type: PRODUCT_LIST_REQUEST })

      const { data } = await axios.get(
        `/api/products/?keyword=${keyword}&page=${pageNumber}&sort=${sort}`
      )

      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.response?.data?.detail || error.message,
      })
    }
  }

// =======================
// PRODUCT DETAILS
// =======================
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })

    const { data } = await axios.get(`/api/products/${id}/`)

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    })
  }
}

// =======================
// TOP PRODUCTS
// =======================
export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST })

    const { data } = await axios.get('/api/products/top/')

    dispatch({
      type: PRODUCT_TOP_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    })
  }
}

// =======================
// DELETE PRODUCT
// =======================
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST })

    await axios.delete(
      `/api/products/${id}/delete/`,
      getConfig(getState)
    )

    dispatch({ type: PRODUCT_DELETE_SUCCESS })
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    })
  }
}

// =======================
// CREATE PRODUCT
// =======================
export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST })

    const { data } = await axios.post(
      `/api/products/create/`,
      {},
      getConfig(getState)
    )

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    })
  }
}

// =======================
// UPDATE PRODUCT
// =======================
export const updateProduct =
  (product) => async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_UPDATE_REQUEST })

      const { data } = await axios.put(
        `/api/products/${product.id}/update/`,
        product,
        getConfig(getState)
      )

      dispatch({
        type: PRODUCT_UPDATE_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: PRODUCT_UPDATE_FAIL,
        payload:
          error.response?.data?.detail || error.message,
      })
    }
  }