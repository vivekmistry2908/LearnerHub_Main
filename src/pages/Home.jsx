import React, { useEffect, useState } from "react";
import Loginpage from "./Loginpage";
import { Link } from "react-router-dom";
import Preloader from "./Preloader";

const Home = () => {
  const[loading,setLoading]=useState(true)
  useEffect(()=>{
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  })
const[emailvalidation,setemailvalidation]=useState("")
// console.log("Emailvalidation",emailvalidation)
  return (
   <div>
    {loading ? (<Preloader/>) : (
       <div className="fixed-background">
       <nav className="container navbar p-3  fixed-top">
         <div className="d-flex justify-content-between w-100">
           <a className="navbar-brand">LOGO</a>
           <form className="d-flex gap-2 gap-sm-4">
           <a href="#" className={emailvalidation==true ? "home-link fw-normal fs-6 text-decoration-none p-2 px-3  text-center rounded-pill d-block" : "d-none"} 
              data-bs-toggle="modal" data-bs-target="#verifyemail">
               Verify Email
             </a>
             <Link to='/loginpage' className="home-link fw-normal fs-6 text-decoration-none p-2 px-3  text-center rounded-pill" >
            <i className="fa-solid fa-key me-1"></i> Login
             </Link>
             <Link to='/signuppage' className=" home-link fs-6 text-decoration-none p-2 px-3 text-center rounded-pill">
             <i className="fa-solid fa-user-plus me-2"></i>Sign Up
             </Link>
           </form>
         </div>
       </nav>
       <div className="home-content">
         <div className="container  pt-5 mt-5">
           <div className="row">
             <div className="col-lg-7">
             <h1 className="pt-4 pb-2 display-4 mt-5 home-heading text-center" style={{fontWeight:'800'}}>Welcome to our Website</h1>
       <div className="input-group pe-0 pe-sm-5 mb-5 px-sm-4">
         <input
           type="search"
           className="home-search form-control form-control mx-auto outline-0  shadow-none py-3 border-end-0 ps-4"
           placeholder="Search...."
           aria-label="Recipient's username"
           aria-describedby="basic-addon2" style={{borderRadius:'30px 0px 0px 30px'}}
         />
         <span className="input-group-text fw-bold bg-white border-start-0 px-3" id="basic-addon2" style={{borderRadius:'0px 30px 30px 0px'}}>
         <i className="fa-solid fa-magnifying-glass text-secondary fs-5"></i>
         </span>
       </div>
             </div>
             <div className="col-lg-5 d-flex justify-content-center">
               <img src={require('../img/teamwork-and-brainstorming-removebg-preview.png')} className="img-fluid" alt="" />
             </div>
           </div>
       
 
       {/* <Link to='/dashboard' className="">Go</Link> */}
     </div>
     
       </div>
     </div>
    )}
   </div>
  );
};

export default Home;
