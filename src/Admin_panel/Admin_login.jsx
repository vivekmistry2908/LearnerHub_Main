import React, { useState,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ipaddress } from '../App'
import First_navabr from '../components/First_navabr'
import { Context } from '../context/Context_provider'
import { toast } from 'react-toastify'

const Admin_Loginpage = ({setemailvalidation}) => {

  const {translate_value}=useContext(Context)
  const[userid,setUserid]=useState("")
  const[password,setPassword]=useState("")
  const[password_type,setPassword_type]=useState(false)
  const useridData=(e)=>{
    setUserid(e.target.value)
  }
  const passwordData=(e)=>{
    setPassword(e.target.value)
  }

  let navigate=useNavigate()

  const[loading,setloading]=useState()
  const verifiedlogin=(e)=>{
    e.preventDefault()

    setloading(true)
    const values={userid,password}
      axios.post(`${ipaddress}/admin_app/AdminLogin/`,values)
      .then((r)=>{
        console.log("Login successfully", r.data);
      setloading(false)
      navigate('/user_page')
      setUserid("")
      setPassword("")
      })
    .catch(()=>{
      // Handle error
      console.error("Error Message");
      setloading(false)
      setUserid("")
      setPassword("")
      toast.error('Invalid Email and Password',{
        autoClose:3000,
      })
setloading(false)
    })
  }

  // ---------------------------------------------------------VERIFY- EMAIL--------------------------------------------------
  const[email,setEmail]=useState("")
  const[otp,setOtp]=useState()
  const verifyemaildata=(e)=>{
    setEmail(e.target.value)
  }
  const verifyEmail=(e)=>{
    e.preventDefault()
axios.post(`${ipaddress}/userverification/`)
.then((r)=>{
  // console.log("OTP FETCHED",r.data)
  setOtp(r.data.otp)
})
  }

  const[newotp,setNewotp]=useState("")
  const otpdata=(e)=>{
    setNewotp(e.target.value)
  }
  const submitOtp=(e)=>{
    e.preventDefault()
    if(newotp===otp){
      axios.put(`${ipaddress}/CheckEmailForThreeMonths/${userid}/`)
.then((r)=>{
  // console.log("Otp validated and sent",r.data)
  setNewotp("")
})
    }
    else{
      // console.log("Invalid OTP")
    }
  }

// ---------------------------------------------Forgot Password functionality---------------------------------------------

const[forgotpassmail,setForgotpassemail]=useState("")
const forgotpassword=()=>{
  const formdata=new FormData()
  formdata.append('email',forgotpassmail)
  formdata.append('url','https://lernen-hub.de/forgot_password/')

  axios.post(`${ipaddress}/ForgetPassword/`,formdata)
  .then((r)=>{
    // console.log("URL Sent successfully",r.data)
  })
}
return (
    <div>
        <div className='bg-light pb-4' style={{minHeight:'100vh'}}>
        <div className="container animate__animated animate__fadeIn">
          <First_navabr/>
        </div>
      
        <div className="row mt-4 m-0 h-100 animate__animated animate__fadeIn">
          <div className="col-lg-6 d-flex justify-content-center align-items-center">
            <div className='bg-white shadow rounded pt-5 pb-3 px-3 login-form d-flex flex-column align-items-center justify-content-center' style={{height:'544px'}}>
              <h3 className='text-center mb-5 fw-bold'>{translate_value.login_page.login}</h3>
            <form action="" className='p-2 px-2 w-100' onSubmit={verifiedlogin}>
                <div className="mb-4">
                <label for="floatingInput" style={{color:'#8E9696'}} className='mb-2'>{translate_value.login_page.email}</label>
          <input type="text" name='userid' className="form-control shadow-none bg-light" id="floatingInput" style={{height:'50px'}} onChange={useridData} value={userid}/>
        </div>
        
        <div className="mb-2">
        <label for="floatingPassword" style={{color:'#8E9696'}} className='mb-2'>{translate_value.login_page.password}</label>
          <div className="input-group mb-3 bg-light border rounded">
          <input type={password_type ? "text" : "password"} name='password' className="form-control shadow-none border-0 bg-transparent" style={{height:'50px'}} id="floatingPassword" onChange={passwordData} value={password}/>
  <span onClick={()=>{
    setPassword_type(!password_type)
  }} style={{cursor:'pointer'}}  className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
</svg></span>
</div>
        </div>
        <div className='text-end mb-4'>
          <a href="" style={{color:'#FF845D',textDecoration:'none'}} data-bs-toggle="modal" data-bs-target="#forgotpassword">{translate_value.login_page.forgot_password}</a>
        </div>
        <div className="text-center">
            <button type='submit' className='btn Login-btn btn-md py-2 px-5 text-white fw-medium'> {loading ? 'Loading...': `${translate_value.login_page.submit}`}</button>
        </div>     
        <div className='mt-5 text-center'>
          <p className='m-0'>Facing problem signing in. <span style={{color:'#5d5fe3',cursor:'pointer'}} onClick={()=>{
            navigate('/contact_us')
          }} className='fw-medium'>Need Help</span></p>
        </div>
        </form>
        {/* <Link to='/forgot_password/pattern' className='text-decoration-none mt-4 w-100 text-center' style={{fontSize:'15px',color:'#8E9696'}}><input type="checkbox" className='me-2' /> <span>By Login you <a className='fw-medium' style={{textDecoration:'underline',color:'#2A3941'}}> {translate_value.login_page.agree_to_terms}</a></span></Link> */}
        
                
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-center login-text mt-5 mt-lg-0">
            <div className='' style={{position:'relative'}}>
              <p style={{letterSpacing:'3px'}}>WELCOME BACK</p>
              <h1 className='fw-bold login-header' style={{color:'#2A3941'}}>Improve</h1>
              <h1 className='fw-bold login-header' style={{color:'#2A3941'}}>comprehension</h1>
              <h1 className='fw-bold login-header' style={{color:'#FF845D'}}>together</h1>
              <svg className='login-img3' style={{position:'absolute' ,animation: 'spin 6s linear infinite' }} xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
<path d="M28.43 77.66L0 49.23L0.0700073 48.96L10.4 10.4L10.67 10.33L49.23 0L77.66 28.43L77.59 28.7L67.26 67.26L66.99 67.33L28.43 77.66ZM1.08002 48.95L28.72 76.59L66.48 66.47L76.6 28.71L48.96 1.06998L11.2 11.19L1.08002 48.95Z" fill="#5D5FE3"/>
</svg>
              <img className='login-img1'style={{position:'absolute' ,animation: 'moveAnimation 6s linear infinite',width:'115px',height:'127px' }} src={require('../img//images_icons/Group-removebg-preview.png')} alt="" />
              <img className='login-img2' style={{position:'absolute',height:'135px',width:'31px'}} src={require('../img/images_icons/login-image.png')} alt="" />
              <p className='mt-3' style={{color:'#2A3941',fontSize:'32px'}}>{translate_value.login_page.dont_have_account}</p>
              <Link to='/signuppage' className='btn p-3 px-5 fw-bold' style={{color:'#5D5FE3',border:'1px solid #5D5FE3'}}> {translate_value.login_page.get_started}</Link>
            </div>
          </div>
        </div>
        
        
        <div className="modal fade modal-md" id="verifyemail" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="d-flex p-2">
                <button type="button" className="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div>
              <h3 className=" fw-bold text-center fs-2 text-primary" id="staticBackdropLabel">Enter Your Email</h3>
              </div>
              <div className="modal-body">
                <form action="" className='p-2 px-4' onSubmit={verifyEmail}>
                <div className="form-floating mb-4">
          <input type="text" name='userid' className="form-control shadow-none" id="floatingInput" placeholder="name@example.com" onChange={verifyemaildata} value={email}/>
          <label for="floatingInput" className='fw-normal'>Email</label>
        </div>
        <div className="text-center">
            <button type='submit' className='btn Login-btn btn-md py-3 w-100 text-white fw-medium' data-bs-toggle="modal" data-bs-target="#otpmodal">Verify Email</button>
        </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal fade" id="otpmodal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h1 className="modal-title fs-5 mx-auto" id="exampleModalToggleLabel2">Enter the OTP</h1>
              </div>
              <div className="modal-body">
              <form action="" className="p-2 px-4" onSubmit={submitOtp}>
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-floating mb-4">
                              <input onChange={otpdata} value={newotp}
                                type="text"
                                className="form-control shadow-none"
                                id="floatingInput"
                                placeholder="name@example.com"
                                name="first_name"
                              />
                              <label for="floatingInput" className="fw-normal" >
                                Enter Your OTP
                              </label>
                            </div>
                          </div>
                          </div>
                        <div className="text-center">
                          <button
                            className="btn signup-btn btn-md py-3 w-100 text-white fw-medium"
                            type="submit" data-bs-target="#login" data-bs-dismiss="modal"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
              </div>
            </div>
          </div>
        </div>
        
        {/* -------------------------------------------FORGOT PASSWORD-------------------------------------------------------------- */}
        <div className="modal fade modal-md" id="forgotpassword" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body pb-5">
              <div className="d-flex">
              <button data-bs-dismiss="modal" className='bg-transparent border-0 ms-auto'><i className="fa-solid fa-circle-xmark fs-5"></i></button>
        
              </div>
              <div className='py-3'>
              <h6 className=" fw-bold text-center fs-3 text-dark" id="staticBackdropLabel">Forgot Password</h6>
              </div>
                <form action="" className='p-2 mt-3 px-4 mb-5'>
                  <p className='text-center'>Please enter your registered email ID</p>
                <div className="form-floating mb-4">
          <input type="text" name='userid' className="form-control shadow-none" id="floatingInput" placeholder="name@example.com" onChange={(e)=>{
            setForgotpassemail(e.target.value)
          }} value={forgotpassmail}/>
          <label for="floatingInput" className='fw-normal'>Email</label>
        </div>
        <div className="text-center mt-5">
            <button type='submit' className='btn Login-btn btn-md py-2 w-100 text-white fw-medium' 
            data-bs-toggle="modal" data-bs-target="#forgotpasswordsuccessfull" 
            onClick={forgotpassword}>Submit</button>
        </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        {/* --------------------------------------------SUCCESSFULLY CHANGED PASSWORD-------------------------------------------- */}
        <div className="modal fade modal-md" id="forgotpasswordsuccessfull" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body pb-5">
              <div className='d-flex flex-column align-items-center justify-content-center' style={{height:'300px'}}>
                <img src={require('../img/check__2_-removebg-preview.png')} width={70} alt="" />
                <p className='m-0 mt-3' style={{color:'#34a853'}}>We've Sent the link to rest the password</p>
                <p className='m-0' style={{color:'#34a853'}}>in your registered Email ID</p>
                <span style={{color:'#34a853'}}>Please check your Inbox</span>
              </div>
              <div>
                  <button className='btn' data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* ---------------------------------------------TOAST------------------------------------------------------- */}
        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div id="liveToast2" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            
            <div className="toast-body d-flex justify-content-between px-4 py-2">
              <span id='toastbody2'></span> 
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>
            </div>

    </div>
  ) 
}

export default Admin_Loginpage