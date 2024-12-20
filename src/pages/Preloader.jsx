import React, { useState, useEffect } from 'react';
// import { ThreeDots } from 'react-loader-spinner';
import { ColorRing } from 'react-loader-spinner';

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  

  // useEffect(() => {
  //   // Simulate data loading
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  // }, []);

  return (
    <div>
        <div className='d-flex justify-content-center align-items-center' style={{height:'100vh'}}>
  <ColorRing
  visible={true}
  height="80"
  width="80"
  ariaLabel="color-ring-loading"
  wrapperStyle={{}}
  wrapperClass="color-ring-wrapper"
  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
  />
        </div>
    </div>
  );
};

export default Preloader
