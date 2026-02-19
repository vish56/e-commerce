import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listOrders } from '../redux/actions/orderActions'

const AdminOrderScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders = [] } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, userInfo])

  return (
    <>
      <h1>All Orders (Admin)</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>

                {/* ✅ FIXED USER COLUMN */}
                <td>
                  {order.user ? (
                    <>
                      {order.user.name}
                      <br />
                      <small>{order.user.email}</small>
                    </>
                  ) : (
                    '—'
                  )}
                </td>

                <td>
                  {order.createdAt
                    ? order.createdAt.substring(0, 10)
                    : '—'}
                </td>

                <td>₹{order.totalPrice}</td>

                <td>
                  {order.isPaid ? (
                    order.paidAt
                      ? order.paidAt.substring(0, 10)
                      : 'Yes'
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }} />
                  )}
                </td>

                <td>
                  {order.isDelivered ? (
                    order.deliveredAt
                      ? order.deliveredAt.substring(0, 10)
                      : 'Yes'
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }} />
                  )}
                </td>

                <td>
                  <Link to={`/order/${order.id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default AdminOrderScreen
