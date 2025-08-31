// src/App.js
import React from 'react'
import { Container } from 'react-bootstrap'
import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

// Screens
import HomeScreen from './Screen/HomeScreen'
import ProductScreen from './Screen/ProductScreen'
import CartScreen from './Screen/CartScreen'
import LoginScreen from './Screen/LoginScreen'
import RegisterScreen from './Screen/RegisterScreen'
import ShippingScreen from './Screen/ShippingScreen'
import PaymentScreen from './Screen/PaymentScreen'
import PlaceOrderScreen from './Screen/PlaceOrderScreen'
import AdminOrderScreen from './Screen/AdminOrderScreen'
import ProductListScreen from './Screen/ProductListScreen'

function App() {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/cart/:id" element={<CartScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path='/admin/orderlist' element={<AdminOrderScreen />} />
            <Route path='/admin/productlist' element={<ProductListScreen />} />


            {/* Admin Routes */}
            <Route path="/admin/orderlist" element={<AdminOrderScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default App
