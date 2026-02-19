import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Carousel } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { listProducts, listTopProducts } from '../redux/actions/productActions'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'

const HomeScreen = () => {
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products = [] } = productList

  const productTopRated = useSelector((state) => state.productTopRated)
  const {
    loading: loadingTop,
    error: errorTop,
    products: topProducts = [],
  } = productTopRated

  useEffect(() => {
    dispatch(listProducts())
    dispatch(listTopProducts())
  }, [dispatch])

  return (
    <div className="container">

      {/* ===================== */}
      {/* Top Products Carousel */}
      {/* ===================== */}
      {loadingTop ? (
        <Loader />
      ) : errorTop ? (
        <Message variant="danger">{errorTop}</Message>
      ) : (
        <Carousel pause="hover" className="bg-dark mb-4 rounded">
          {topProducts.map((product) => (
            <Carousel.Item key={product.id}>
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="d-block w-100"
                  style={{ height: '400px', objectFit: 'cover' }}
                />
                <Carousel.Caption className="bg-dark bg-opacity-75 rounded">
                  <h4>
                    {product.name} (₹{product.price})
                  </h4>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* ===================== */}
      {/* Latest Products Grid */}
      {/* ===================== */}
      <h1 className="my-4">Latest Products</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.length === 0 ? (
            <h2>No Products Found</h2>
          ) : (
            products.map((product) => (
              <Col
                key={product.id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                className="mb-4"
              >
                <Product product={product} />
              </Col>
            ))
          )}
        </Row>
      )}
    </div>
  )
}

export default HomeScreen
