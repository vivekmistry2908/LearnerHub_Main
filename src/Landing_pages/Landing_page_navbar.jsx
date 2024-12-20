import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Landing_page_navbar = ({state}) => {
    // const[state,setstate]=useState("home")

    const navigate=useNavigate()

  return (
    <div>
           <div>
            <div className='d-none d-lg-block' style={{height:'10vh'}}>
                <div className="container py-3 d-flex justify-content-between">
                    <div className='w-25'>
                        <img className='' src={require('../img/landing_page/Group 385.png')} alt="" />
                    </div>

                        <ul className='d-flex justify-content-end w-75 align-items-center gap-5' style={{listStyleType:'none',cursor:'pointer'}}>
                            <li className={`list ${state==="home" ? 'text-decoration-underline':'text-decoration-none'}`} onClick={()=>{
                                navigate('/')
                            }} style={{color:state === "home" ? '#5D5FE3' : '#2A3941'}}>Home</li>
                            <li className={`list ${state==="about_us" ? 'text-decoration-underline':'text-decoration-none'}`}  onClick={()=>{
                                navigate('/our_team')
                            }} style={{color:state === "about_us" ? '#5D5FE3' : '#2A3941'}}>About us</li>
                            <li className={`list ${state==="stories" ? 'text-decoration-underline':'text-decoration-none'}`}  onClick={()=>{
                                navigate('/stories')
                            }} style={{color:state === "stories" ? '#5D5FE3' : '#2A3941'}}>Stories</li>
                            <li className={`list ${state==="contact_us" ? 'text-decoration-underline':'text-decoration-none'}`}  onClick={()=>{
                                navigate('/contact_us')
                            }} style={{color:state === "contact_us" ? '#5D5FE3' : '#2A3941'}}>Contact us</li>
                            <li><button className='btn list bg-transparent px-3' onClick={()=>{
                                navigate('/loginpage')
                            }} style={{height:'50px',border:'0.5px solid #5d5fe3',color:'#5d5fe3'}}>Get Started</button></li>
                        </ul>
                    <div>

                    </div>
                </div>
            </div>
            </div>

            <nav className="navbar bg-transparent d-block d-lg-none">
  <div className="container d-flex justify-content-between">
    <a className="navbar-brand" href="#">
      <img src={require('../img/landing_page/Group 385.png')} width={120} />
    </a>
    <svg data-bs-toggle="offcanvas" data-bs-target="#landingpage_offcanvas" aria-controls="landingpage_offcanvas" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-justify-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
</svg>
  </div>
</nav>


            <div
        className="offcanvas offcanvas-end d-sm-block d-lg-none d-xl-none"
        tabindex="-1"
        id="landingpage_offcanvas"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header d-flex align-items-center">
         <img src={require('../img/landing_page/Group 385.png')} width={120} alt="" />
         <svg data-bs-dismiss="offcanvas" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
        </svg>
        </div>
        <div className="offcanvas-body">
          <div className="pb-5">
          <ul className="nav flex-column gap-3 text-start ps-0 mt-4">
  <li className="nav-item">
    <Link to='/' className="nav-link d-flex align-items-center">
    <span className="fw-medium" style={{color:'#5d5fe3'}}><i className="fa-solid fa-house me-3" style={{color:'#5d5fe3'}}></i>Home</span></Link>
  </li>
  <li className="nav-item">
    <a onClick={()=>{
        navigate('/our_team')
    }} className="nav-link" type="button">
    <span className="fw-medium" style={{color:'#5d5fe3'}}><i className="fa-solid fa-user me-3" style={{color:'#5d5fe3'}}></i>About Us</span></a>
  </li>
  <li className="nav-item">
    <Link to='/stories' className="nav-link">
    <span className="  fw-medium" style={{color:'#5d5fe3'}}><i className="fa-solid fa-heart me-3" style={{color:'#5d5fe3'}}></i>Stories</span></Link>
  </li>
  <li className="nav-item">
    <Link to='/contact_us' className="nav-link">
    <span className="  fw-medium" style={{color:'#5d5fe3'}}><i className="fa-solid fa-phone me-3" style={{color:'#5d5fe3'}}></i>Contact Us</span></Link>
  </li>
  <li className="nav-item">
    <Link to='/loginpage' className="nav-link">
    <span className="  fw-medium" style={{color:'#5d5fe3'}}><i className="fa-solid fa-arrow-right me-3" style={{color:'#5d5fe3'}}></i>Get Started</span></Link>
  </li>
</ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing_page_navbar