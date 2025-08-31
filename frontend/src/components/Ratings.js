import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#f8e825' }) => {
  return (
    <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>
          {value >= i ? (
            <FaStar style={{ color }} />
          ) : value >= i - 0.5 ? (
            <FaStarHalfAlt style={{ color }} />
          ) : (
            <FaRegStar style={{ color }} />
          )}
        </span>
      ))}
      {text && <span style={{ marginLeft: '6px' }}>{text}</span>}
    </div>
  );
};

export default Rating;
