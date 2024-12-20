import React from 'react'
import { useEffect,useState } from 'react';

const Loader = () => {
    const [loading, setLoading] = useState(true);
  

    useEffect(() => {
      // Simulate data loading
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }, []);
  return (
    <div>Loader</div>
  )
}

export default Loader