// frontend/src/redux/actions/productActions.js
import API from '../../axios' // use the axios instance you created
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from '../constants/productConstants'

// List all products
export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST })

    // use relative path because API.baseURL already includes /api/
    const { data } = await API.get('products/')

    // adjust based on your backend response:
    // if backend returns { products: [...] } keep data.products
    // if backend returns the array directly, use data
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data.products ? data.products : data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    })
  }
}

// Product details
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })

    // again use relative path
    const { data } = await API.get(`products/${id}/`)

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    })
  }
}
