
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaUser, FaShoppingCart } from 'react-icons/fa'; // 

const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>

          <Navbar.Brand href="/" style={{ textTransform: 'none' }}>
  ShopCom
</Navbar.Brand>


          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">

              
              <Nav.Link href="/cart">
                <FaShoppingCart style={{ marginRight: '5px' }} /> Cart
              </Nav.Link>

             
              <Nav.Link href="/login">
                <FaUser style={{ marginRight: '5px' }} /> Login
              </Nav.Link>

            </Nav>
          </Navbar.Collapse>

        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
