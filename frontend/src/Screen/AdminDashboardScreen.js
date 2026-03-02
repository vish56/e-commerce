import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Row, Col, Card, Table } from 'react-bootstrap'
import { listOrders } from '../redux/actions/orderActions'
import { listUsers } from '../redux/actions/userActions'
import { listProducts } from '../redux/actions/productActions'

const AdminDashboardScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderList = useSelector((state) => state.orderList)
  const userList = useSelector((state) => state.userList)
  const productList = useSelector((state) => state.productList)

  const orders = orderList.orders || []
  const users = userList.users || []
  const products = productList.products || []

  const loading =
    orderList.loading || userList.loading || productList.loading

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
      dispatch(listUsers())
      dispatch(listProducts('', 1, ''))
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, userInfo])

  // ===== Metrics =====
  const totalUsers = users.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.totalPrice || 0),
    0
  )

  const lowStockCount = products.filter(
    (product) => product.countInStock < 5
  ).length

  const paidOrders = orders.filter((o) => o.isPaid).length
  const unpaidOrders = orders.filter((o) => !o.isPaid).length

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <>
      <h1 className="mb-4">Admin Dashboard</h1>

      {loading ? (
        <h4>Loading...</h4>
      ) : (
        <>
          {/* Top Metrics */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="p-3 shadow-sm">
                <h6>Total Users</h6>
                <h3>{totalUsers}</h3>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="p-3 shadow-sm">
                <h6>Total Orders</h6>
                <h3>{totalOrders}</h3>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="p-3 shadow-sm">
                <h6>Total Revenue</h6>
                <h3>₹{totalRevenue.toFixed(2)}</h3>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="p-3 shadow-sm">
                <h6>Low Stock Items</h6>
                <h3>{lowStockCount}</h3>
              </Card>
            </Col>
          </Row>

          {/* Order Status Breakdown */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="p-3 shadow-sm">
                <h6>Paid Orders</h6>
                <h3>{paidOrders}</h3>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="p-3 shadow-sm">
                <h6>Unpaid Orders</h6>
                <h3>{unpaidOrders}</h3>
              </Card>
            </Col>
          </Row>

          {/* Recent Orders */}
          <Card className="p-3 shadow-sm">
            <h5>Recent Orders</h5>
            <Table striped bordered hover responsive className="table-sm mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USER</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user?.name || '—'}</td>
                    <td>
                      {order.createdAt
                        ? order.createdAt.substring(0, 10)
                        : '—'}
                    </td>
                    <td>₹{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        'Yes'
                      ) : (
                        <span style={{ color: 'red' }}>No</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/order/${order.id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </>
  )
}

export default AdminDashboardScreen