import React from 'react'
// import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <div style={{backgroundColor:'#F9F9FB',height:'100vh'}}>
      <div className='d-flex flex-column align-items-center justify-content-center' style={{backgroundColor:'#fff',height:'100%'}}>
        <img className='error-img m-0' src={require('../img/landing_page/Group 470.png')} alt="" />
        <p className='error-text2 m-0'>You’ve discovered a secret place, but unfortunately,</p>
        <p className='error-text3 m-0'>it’s just our 404 page</p>
        <a className='error-link mt-2 fs-5'>return to home page</a>
      </div>
    </div>
  )
}

export default Error