import React from 'react'
import { Card, Badge } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Rating from './Rating'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/actions/cartActions'
import { IMAGE_BASE_URL } from '../constants'

const Product = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addToCartHandler = () => {
    dispatch(addToCart(product.id, 1))
    navigate('/cart')
  }

  // IMAGE URL BUILDER
  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${IMAGE_BASE_URL}${product.image}`
    : 'https://via.placeholder.com/300x300?text=No+Image'

  return (
    <Card className="my-3 p-3 rounded shadow-sm">
      <Link to={`/product/${product.id}`}>
        <Card.Img
          variant="top"
          src={imageUrl}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
          }}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={Number(product.rating)}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as="h3">₹{product.price}</Card.Text>

        {/* ===================== */}
        {/* Stock Badge */}
        {/* ===================== */}
        <div className="mb-2">
          {product.countInStock === 0 ? (
            <Badge bg="danger">Out of Stock</Badge>
          ) : product.countInStock <= 5 ? (
            <Badge bg="warning" text="dark">
              Only {product.countInStock} left!
            </Badge>
          ) : (
            <Badge bg="success">In Stock</Badge>
          )}
        </div>

        <button
          className="btn btn-primary btn-sm mt-2"
          onClick={addToCartHandler}
          disabled={product.countInStock === 0}
        >
          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </Card.Body>
    </Card>
  )
}

export default Product
