import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../redux/actions/productActions'
import Product from '../components/Product'

const HomeScreen = () => {
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products = [] } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  return (
    <div className="container">
      <h1 className="my-4">Latest Products</h1>

      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <div className="row">
          {products.length === 0 ? (
            <h2>No Products Found</h2>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4"
              >
                <Product product={product} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default HomeScreen
