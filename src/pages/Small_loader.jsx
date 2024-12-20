import React, { useState, useEffect } from 'react';
import { RotatingLines } from 'react-loader-spinner';

const Small_Preloader = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div>
        <div className='d-flex justify-content-center mt-5'>
        <RotatingLines
  visible={true}
  height="40"
  width="40"
  color="#0DCAF0"
  strokeWidth="5"
  animationDuration="0.75"
  ariaLabel="rotating-lines-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
        </div>
    </div>
  );
};

export default Small_Preloader
