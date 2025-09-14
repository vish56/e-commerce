// src/screens/PlaceOrderScreen.js
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import Message from '../components/Message'
import { createOrder } from '../redux/actions/orderActions'

const PlaceOrderScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector((state) => state.cart)
  const { cartItems = [], shippingAddress = {}, paymentMethod } = cart

  // Calculate prices
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2)
  cart.itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.qty), 0)
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10)
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin || {}

  useEffect(() => {
    if (success && order) {
      // navigate to order details (Django returns id)
      navigate(`/order/${order.id}`)
    }
  }, [success, navigate, order])

  // Build a normalized payload that backend expects
  const buildOrderPayload = () => {
    const items = cartItems.map((it) => {
      const productId = it.product || it.productId || it._id || it.id
      return {
        product: Number(productId), // backend expects 'product'
        qty: Number(it.qty || it.quantity || 1),
        price: Number(it.price || 0),
      }
    })

    return {
      orderItems: items,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'COD',
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    }
  }

  const placeOrderHandler = (e) => {
    // prevent default form submit / page reload
    if (e && typeof e.preventDefault === 'function') e.preventDefault()

    const payload = buildOrderPayload()
    console.log('DEBUG payload for order:', payload) // remove when stable
    dispatch(createOrder(payload))
    console.log('HANDLER RUNNING', { cartItemsLength: cartItems.length, userInfo });
alert('handler ran')

  }

  return (
    <>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item.product || item._id || item.id}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product || item._id || item.id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  <Message variant="danger">{error}</Message>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  type="button"
                  variant="primary"
                  className="btn-block"
                  disabled={cartItems.length === 0 || !userInfo}
                  onClick={placeOrderHandler}
                >
                  {userInfo ? 'Place Order' : 'Login to Place Order'}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
