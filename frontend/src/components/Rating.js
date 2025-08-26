import React from 'react'

const Rating = ({ value, text }) => {
  return (
    <div className='rating'>
      {[1,2,3,4,5].map(i => (
        <span key={i}>
          <i style={{ color: '#f8e825' }}
             className={
               value >= i ? 'fas fa-star'
               : value >= i - 0.5 ? 'fas fa-star-half-alt'
               : 'far fa-star'
             }>
          </i>
        </span>
      ))}
      <span> {text && text}</span>
    </div>
  )
}

export default Rating
