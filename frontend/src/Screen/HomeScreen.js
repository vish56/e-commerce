import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Carousel } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { listProducts, listTopProducts } from '../redux/actions/productActions'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'

const HomeScreen = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)

  const keyword = searchParams.get('keyword') || ''
  const pageNumber = Number(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || ''

  const { loading, error, products = [], pages } = useSelector(
    (state) => state.productList
  )

  const {
    loading: loadingTop,
    error: errorTop,
    products: topProducts = [],
  } = useSelector((state) => state.productTopRated)

  // Debounced product fetch
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(listProducts(keyword, pageNumber, sort))
    }, 300)

    return () => clearTimeout(delay)
  }, [dispatch, keyword, pageNumber, sort])

  // Top products only when no search
  useEffect(() => {
    if (!keyword) {
      dispatch(listTopProducts())
    }
  }, [dispatch, keyword])

  return (
    <div className="container">

      {!keyword && (
        loadingTop ? (
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
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        )
      )}

      <h1 className="my-4">
        {keyword ? `Search: ${keyword}` : 'Latest Products'}
      </h1>

      <div className="d-flex justify-content-end mb-3">
        <select
          className="form-select w-auto"
          value={sort}
          onChange={(e) => {
            const newSort = e.target.value
            let query = `?page=1`

            if (keyword) query += `&keyword=${keyword}`
            if (newSort) query += `&sort=${newSort}`

            navigate(query)
          }}
        >
          <option value="">Default</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.length === 0 ? (
              <h2>No Products Found</h2>
            ) : (
              products.map((product) => (
                <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))
            )}
          </Row>

          <Paginate pages={pages} page={pageNumber} />
        </>
      )}
    </div>
  )
}

export default HomeScreen