import React, { useState } from 'react'
import { Navbar, Nav, Container, NavDropdown, Form, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/actions/userActions'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState('')

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
    navigate('/login')
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`)
    } else {
      navigate('/')
    }

    setKeyword('')
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>

          <LinkContainer to="/">
            <Navbar.Brand>ShopCom</Navbar.Brand>
          </LinkContainer>

          {/* 🔎 SEARCH BAR */}
          <Form onSubmit={submitHandler} className="d-flex mx-auto">
            <Form.Control
              type="text"
              name="q"
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
              placeholder="Search Products..."
              className="me-2"
            />
            <Button type="submit" variant="outline-light">
              Search
            </Button>
          </Form>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">

              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

            </Nav>
          </Navbar.Collapse>

        </Container>
      </Navbar>
    </header>
  )
}

export default Header
