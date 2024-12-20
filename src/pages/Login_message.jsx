import React from 'react'

const Login_message = ({state,setstate}) => {
  return (
    <div className={`row m-0 py-4 ${state ? '':'d-none'}`} style={{height:'100vh',backgroundColor:'rgba(0,0,0,0.6)',position:'fixed',width:'100%',zIndex:6}}>
        <div className='bg-white animate__animated animate__zoomInUp mx-auto col-md-8 rounded shadow d-flex flex-column align-items-center'>
            <img src={require('../img/landing_page/Group 448.png')} width={330} alt="" />
            <p className='page4-head fs-1' style={{color:'#5D5FE3'}}>Welcome to The Student Community!</p>
            <p className='m-0 fw-medium page4-para' style={{fontSize:'17px'}}>Expand your study network. Connect with peers across cities and exchange diverse insights</p>
            <p className=' fw-medium page4-para' style={{fontSize:'17px'}}>Speak freely, share boldly. Post anonymously and engage in genuine peer-to-peer learning</p>
           <p className='text-decoration-underline mt-4' onClick={()=>{
            setstate(false)
           }} style={{color:'#ff845d',cursor:'pointer'}}>Close</p>
        </div>
    </div>
  )
}

export default Login_message