import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProductScreen = () => {
  const { id } = useParams()
  console.log('Product ID from URL:', id)  // ← ab sahi jagah par hai
  const navigate = useNavigate()

  const [product, setProduct] = useState({})
  const [qty, setQty] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`)
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      }
    }

    fetchProduct()
  }, [id])

  const addToCartHandler = () => {
    navigate(`/cart/${product._id}?qty=${qty}`)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} width='300' />

      <p style={{ marginTop: '20px' }}>{product.description}</p>
      <p>Price: ₹{product.price}</p>

      {product.countInStock > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="qty">Qty: </label>
          <select
            id="qty"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          >
            {[...Array(product.countInStock).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={addToCartHandler}
        disabled={product.countInStock === 0}
        style={{
          padding: '10px 20px',
          backgroundColor: product.countInStock === 0 ? '#ccc' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  )
}

export default ProductScreen
