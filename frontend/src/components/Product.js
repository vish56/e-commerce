import React from 'react'
import { Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Rating from './Rating'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/actions/cartActions'

const Product = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addToCartHandler = () => {
    dispatch(addToCart(product.id, 1))
    navigate('/cart')
  }

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product.id}`}>
        <Card.Img
          variant="top"
          src={`https://e-commerce-2-wajc.onrender.com${product.image}`}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
          }}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.id}`}>
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

        <button
          className="btn btn-primary btn-sm mt-2"
          onClick={addToCartHandler}
        >
          Add to Cart
        </button>
      </Card.Body>
    </Card>
  )
}

export default Product
