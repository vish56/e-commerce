import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../redux/actions/orderActions'

const toNumber = (v, fallback = 0) => {
  const n = Number(String(v))
  return Number.isFinite(n) ? n : fallback
}

const OrderScreen = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderPay = useSelector((state) => state.orderPay)
  const { success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { success: successDeliver } = orderDeliver

  useEffect(() => {
    dispatch(getOrderDetails(id))
  }, [dispatch, id, successPay, successDeliver])

  const payHandler = () => {
    dispatch(payOrder(id))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(id))
  }

  if (loading) return <Loader />
  if (error) return <Message variant="danger">{error}</Message>
  if (!order) return <Message>Order not found</Message>

  const itemsPrice = toNumber(order.itemsPrice)
  const shippingPrice = toNumber(order.shippingPrice)
  const taxPrice = toNumber(order.taxPrice)
  const totalPrice = toNumber(order.totalPrice)

  return (
    <>
      <h1>Order {order._id}</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>{' '}
                {order.user?.name || order.user?.username || '—'}
              </p>
              <p>
                <strong>Email:</strong>{' '}
                {order.user?.email ? (
                  <a href={`mailto:${order.user.email}`}>
                    {order.user.email}
                  </a>
                ) : (
                  '—'
                )}
              </p>
              <p>
                <strong>Address:</strong>{' '}
                {order.shippingAddress
                  ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
                  : '—'}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt?.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment</h2>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt?.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>

              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ₹{item.price} = ₹
                      {(item.qty * item.price).toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
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
                  <Col>₹{itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              {/* ADMIN ACTIONS */}
              {userInfo && userInfo.isAdmin && (
                <>
                  {!order.isPaid && (
                    <ListGroup.Item>
                      <Button className="btn-block" onClick={payHandler}>
                        Mark As Paid
                      </Button>
                    </ListGroup.Item>
                  )}

                  {order.isPaid && !order.isDelivered && (
                    <ListGroup.Item>
                      <Button
                        className="btn-block"
                        onClick={deliverHandler}
                      >
                        Mark As Delivered
                      </Button>
                    </ListGroup.Item>
                  )}
                </>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
