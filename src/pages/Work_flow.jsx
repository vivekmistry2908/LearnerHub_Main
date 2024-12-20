import React from 'react'
import { useNavigate } from 'react-router-dom'

const Work_flow = () => {
  const navigate=useNavigate()

  return (
    <div className='px-2 px-md-4 py-3 animate__animated animate__fadeIn'>
      <div>
        <p style={{cursor:'pointer',textDecoration:'underline',fontSize:'14px',color:'#FF845D'}} onClick={()=>{
          navigate('/dashboard/page')
        }}>Go to Dashboard</p>
        <p className='page4-head text-center fs-1'>Work Flow</p>
      </div>
    </div>
  )
}

export default Work_flow