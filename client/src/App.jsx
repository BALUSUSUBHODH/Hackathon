import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home/Home'
import Register from './Register/Register'
import Login from './Login/Login'
import { AuthProvider } from './context/AuthContext'
import Navigation from './Navigation/Navigation'
import AddProduct from './AddProduct/AddProduct'
import Cart from './Cart/Cart'
import Checkout from './Checkout/Checkout'
import About from './About/About'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise=loadStripe("pk_test_51MOH8zSB0s2EMORR1S7r29neT4EL162r7P5EmVbS71UAcHp55KqfBGfT0b5JbJdHKUuLlhlcNtfvO7mLOLb9lmQW00OSfFmdcL")
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Navigation/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-product" element={<AddProduct/>}/>
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />}/>
            <Route path='/checkout' element={
              <Elements stripe={stripePromise}>
                <Checkout/>
              </Elements>
            }/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}
