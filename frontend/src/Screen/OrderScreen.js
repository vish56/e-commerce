// src/screens/OrderScreen.js
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails } from '../redux/actions/orderActions'

const toNumber = (v, fallback = 0) => {
  if (v === null || v === undefined) return fallback
  // Decimal.js / Django Decimal may come as object with toString; use String() first
  const n = Number(String(v))
  return Number.isFinite(n) ? n : fallback
}

const safeText = (v, fallback = '') => (v === null || v === undefined ? fallback : String(v))

const OrderScreen = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails) || {}
  const { order, loading, error } = orderDetails

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id])

  if (loading) return <Loader />
  if (error) return <Message variant="danger">{error}</Message>
  if (!order) return <Message>Order not found or still loading.</Message>

  // Robustly pick id and numeric totals
  const orderId = order.id ?? order._id ?? order.pk ?? id
  const itemsPriceFromItems = (order.orderItems && order.orderItems.length)
  ? order.orderItems.reduce((acc, it) => acc + (Number(it.qty || 0) * Number(it.price || 0)), 0)
  : 0

const itemsPrice = toNumber(order.itemsPrice ?? order.items_price ?? order.items ?? itemsPriceFromItems)

  const shippingPrice = toNumber(order.shippingPrice ?? order.shipping_price)
  const taxPrice = toNumber(order.taxPrice ?? order.tax_price)
  const totalPrice = toNumber(order.totalPrice ?? order.total_price ?? order.total)

  return (
    <>
      <h1>Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Name: </strong> {safeText(order.user?.name) || safeText(order.user?.first_name) || 'N/A'}</p>
              <p>
                <strong>Email: </strong>
                {order.user?.email ? <a href={`mailto:${order.user.email}`}>{order.user.email}</a> : 'N/A'}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress
                  ? `${order.shippingAddress.address || ''}${order.shippingAddress.city ? `, ${order.shippingAddress.city}` : ''}${order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}${order.shippingAddress.country ? `, ${order.shippingAddress.country}` : ''}`
                  : 'No shipping address'}
              </p>

              {order.isDelivered ? (
                <Message variant="success">Delivered on {order.deliveredAt ?? order.delivered_at ?? 'N/A'}</Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p><strong>Method: </strong>{order.paymentMethod ?? order.payment_method ?? 'N/A'}</p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt ?? order.paid_at ?? 'N/A'}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {(!order.orderItems || order.orderItems.length === 0) ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => {
                    const qty = toNumber(item.qty, 0)
                    const price = toNumber(item.price, 0)
                    const lineTotal = (qty * price)
                    const prodId = item.product ?? item._id ?? item.id

                    return (
                      <ListGroup.Item key={prodId ?? index}>
                        <Row className="align-items-center">
                          <Col md={1}>
                            <Image src={item.image ?? ''} alt={item.name ?? ''} fluid rounded />
                          </Col>
                          <Col>
                            {prodId ? (
                              <Link to={`/product/${prodId}`}>{item.name ?? `Product ${prodId}`}</Link>
                            ) : (
                              <span>{item.name ?? `Product ${index + 1}`}</span>
                            )}
                          </Col>
                          <Col md={4}>
                            {qty} x ₹{price.toFixed(2)} = ₹{Number.isFinite(lineTotal) ? lineTotal.toFixed(2) : '0.00'}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )
                  })}
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
                <Row><Col>Items</Col><Col>₹{itemsPrice.toFixed(2)}</Col></Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row><Col>Shipping</Col><Col>₹{shippingPrice.toFixed(2)}</Col></Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row><Col>Tax</Col><Col>₹{taxPrice.toFixed(2)}</Col></Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row><Col>Total</Col><Col>₹{totalPrice.toFixed(2)}</Col></Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
