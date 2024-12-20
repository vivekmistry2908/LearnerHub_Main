import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ipaddress } from '../App'
import { Link, useNavigate } from 'react-router-dom'

const Admin_navbar = () => {

  const navigate=useNavigate()

  const logout=()=>{
    axios.delete(`${ipaddress}/admin_app/AdminLogin/`)
    .then((r)=>{
    navigate('/admin_login')
    })
  }

    const[notifications,setNotifications]=useState([])

    const fetchnotifications=()=>{
        axios.get(`${ipaddress}/admin_app/api/DisplayAdminNotifications/`)
        .then((r)=>{
            // console.log("Admin notifications",r.data)
            setNotifications(r.data.reverse())
        })
        .catch((err)=>{
            // console.log("Admin notifications error",err)
        })
    }

    // Delete Notification
    const deletenotifications=(id)=>{
        axios.delete(`${ipaddress}/admin_app/api/DisplayAdminNotifications/${id}/`)
        .then((r)=>{
            // console.log("Admin notifications deleted",r.data)
            fetchnotifications()
        })
        .catch((err)=>{
            // console.log("Admin notifications deleting error",err)
        })
    }


    useEffect(()=>{
        fetchnotifications()
    },[])



  return (
    <div>
       <div className='d-none d-lg-block'>
       <div className='row m-0 mx-auto py-3 px-2' style={{position:'sticky',width:'100%',top:0}}>
            <div className="col-2 d-flex align-items-center">
                <img src={require('../img/landing_page/Group 385.png')} style={{width:'100%'}} alt="" />
            </div>

            <div className='col-10 p-0 pe-3'>
                <ul style={{listStyleType:'none'}} className='h-100 pe-4  align-items-center d-flex gap-5 w-75 ms-auto justify-content-end'>
                <li data-bs-toggle="offcanvas" data-bs-target="#notification" aria-controls="notification" style={{cursor:'pointer'}} onClick={()=>{
                    // navigate('/')
                }}><span className='navbar-li d-flex align-items-center'><img src={require('../img/landing_page/Vector.png')} alt="" /><span className='ms-1' style={{fontSize:'14px'}}>{notifications.length}</span></span></li>
                </ul>
            </div>
        </div>
       </div>

{/* -----------------------------------------------Big Screen Notification Layout---------------------------------------------- */}
<div className="offcanvas offcanvas-end border-0 shadow" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="notification" aria-labelledby="notificationLabel" style={{marginTop:'74px'}}>
  <div className="offcanvas-header py-4" style={{backgroundColor:'#F3F0FF'}}>
    <h5 className="offcanvas-title d-flex align-items-center" id="offcanvasScrollingLabel" style={{fontSize:'16px'}}>Notifications
    </h5>
    <button data-bs-dismiss="offcanvas" aria-label="Close" className='bg-transparent border-0'><i className="fa-solid fa-circle-xmark fs-5 text-secondary"></i></button>
  </div>
  <div className="offcanvas-body p-0 px-2">
  
  <ul className={notifications.length<=0 ? "d-none" : "p-0"} style={{listStyleType:'none'}} aria-labelledby="notificationDropdown">
                   

                    {notifications &&(
  notifications.map((x)=>{
    return(
      <li className=" px-1 py-3 border-bottom">
      <div className="d-flex align-items-center justify-content-between">
  <div className="">
<p className="text-dark m-0" style={{fontSize:'16px'}}>{x.message}</p>
<span className='d-flex align-items-center mt-1 text-secondary' style={{fontSize:'13px'}}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#FF845D" className="bi bi-calendar" viewBox="0 0 16 16">
  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
</svg><span className='ms-1 me-4' style={{fontSize:'12px'}}>{x.created_at!=undefined && x.created_at.slice(0,10)}</span> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#FF845D" className="bi bi-clock" viewBox="0 0 16 16">
  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
</svg><span className='ms-1' style={{fontSize:'12px'}}>{x.created_at!=undefined && x.created_at.substring(11,19)}</span></span>

</div>
      <button className="btn btn-sm btn-transparent ms-2 border-0" onClick={()=>{
          deletenotifications(x.id)
         }}><i className="fa-solid fa-xmark"></i></button>
 </div>
     
</li>
    )
  })
                    )}
       
  </ul> 
  </div>
</div>


<nav className="navbar bg-transparent d-block d-lg-none py-3 mb-2">
  <div className="container d-flex justify-content-between">
  <svg data-bs-toggle="offcanvas" data-bs-target="#admin_offcanvas" aria-controls="admin_offcanvas" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-justify-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
</svg>
<span data-bs-toggle="offcanvas" data-bs-target="#notification" aria-controls="notification" className='navbar-li'><img src={require('../img/landing_page/Vector.png')} width={16} alt="" /></span>
  </div>
</nav>


{/* Mobile Screen Offcanvas */}

<div
        className="offcanvas offcanvas-start d-sm-block d-lg-none d-xl-none"
        data-bs-backdrop="static" tabindex="-1"
        id="admin_offcanvas"
        aria-labelledby="admin_offcanvasLabel"
      >
        <div className="offcanvas-header d-flex justify-content-between align-items-center">
          <img src={require('../img/landing_page/Group 385.png')} width={120} alt="" />
          <svg data-bs-dismiss="offcanvas" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
</svg>
        </div>
        <div className="offcanvas-body">
          <div className="pb-5">
          <ul className="nav flex-column gap-3 text-start ps-0">
  <li data-bs-dismiss="offcanvas" className="nav-item">
    <Link to='/user_page' className="nav-link"><span className="nav-icon ms-1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 29 21" fill="none">
  <path d="M0.786049 20.1475V17.7468C0.786049 17.07 0.961328 16.488 1.31189 16.001C1.66245 15.514 2.13355 15.1247 2.72519 14.8333C3.99013 14.231 5.24612 13.7509 6.49316 13.3928C7.74023 13.0348 9.24064 12.8558 10.9944 12.8558C12.7481 12.8558 14.2485 13.0348 15.4956 13.3928C16.7426 13.7509 17.9986 14.231 19.2636 14.8333C19.8552 15.1247 20.3263 15.514 20.6769 16.001C21.0274 16.488 21.2027 17.07 21.2027 17.7468V20.1475H0.786049ZM24.1194 20.1475V17.6795C24.1194 16.8344 23.9483 16.0367 23.6063 15.2864C23.2642 14.536 22.779 13.8922 22.1506 13.3549C22.8667 13.5008 23.5566 13.7032 24.2203 13.9621C24.8841 14.2211 25.5403 14.5123 26.1891 14.8357C26.8211 15.1536 27.3165 15.5603 27.6755 16.056C28.0345 16.5516 28.2139 17.0928 28.2139 17.6795V20.1475H24.1194ZM10.9944 9.60258C9.79126 9.60258 8.76131 9.17419 7.90454 8.31742C7.04777 7.46065 6.61938 6.4307 6.61938 5.22758C6.61938 4.02443 7.04777 2.99447 7.90454 2.1377C8.76131 1.28092 9.79126 0.852539 10.9944 0.852539C12.1975 0.852539 13.2275 1.28092 14.0842 2.1377C14.941 2.99447 15.3694 4.02443 15.3694 5.22758C15.3694 6.4307 14.941 7.46065 14.0842 8.31742C13.2275 9.17419 12.1975 9.60258 10.9944 9.60258ZM21.5954 5.22758C21.5954 6.4307 21.167 7.46065 20.3102 8.31742C19.4534 9.17419 18.4235 9.60258 17.2204 9.60258C17.1587 9.60258 17.0801 9.59556 16.9848 9.58154C16.8894 9.56752 16.8109 9.55209 16.7492 9.53527C17.2432 8.93019 17.6228 8.25893 17.8881 7.5215C18.1534 6.78407 18.286 6.01826 18.286 5.22408C18.286 4.42992 18.1472 3.67106 17.8696 2.94751C17.5919 2.22396 17.2185 1.54807 16.7492 0.919841C16.8277 0.891817 16.9062 0.873588 16.9848 0.865154C17.0633 0.856744 17.1418 0.852539 17.2204 0.852539C18.4235 0.852539 19.4534 1.28092 20.3102 2.1377C21.167 2.99447 21.5954 4.02443 21.5954 5.22758ZM2.24438 18.6891H19.7444V17.7468C19.7444 17.4046 19.6588 17.1055 19.4878 16.8494C19.3167 16.5932 19.0096 16.3483 18.5665 16.1146C17.4784 15.5331 16.3313 15.0877 15.1254 14.7782C13.9195 14.4688 12.5425 14.3141 10.9944 14.3141C9.44631 14.3141 8.0693 14.4688 6.86336 14.7782C5.65744 15.0877 4.51041 15.5331 3.42228 16.1146C2.97916 16.3483 2.67206 16.5932 2.50098 16.8494C2.32991 17.1055 2.24438 17.4046 2.24438 17.7468V18.6891ZM10.9944 8.14424C11.7965 8.14424 12.4831 7.85865 13.0543 7.28747C13.6255 6.71629 13.911 6.02966 13.911 5.22758C13.911 4.42549 13.6255 3.73886 13.0543 3.16768C12.4831 2.5965 11.7965 2.31091 10.9944 2.31091C10.1923 2.31091 9.50567 2.5965 8.93449 3.16768C8.36331 3.73886 8.07772 4.42549 8.07772 5.22758C8.07772 6.02966 8.36331 6.71629 8.93449 7.28747C9.50567 7.85865 10.1923 8.14424 10.9944 8.14424Z" fill="currentColor"/>
</svg></span>
    <span className="ms-4  fw-medium text-secondary">User Page</span></Link>
  </li>
  <li data-bs-dismiss="offcanvas" className="nav-item">
    <a onClick={()=>{
      navigate('/university_details')
    }} className="nav-link" type="button"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 25 27" fill="none">
  <path d="M4.47908 21.7917V10.125H5.93742V21.7917H4.47908ZM11.7708 21.7917V10.125H13.2291V21.7917H11.7708ZM0.160156 26.1667V24.7083H24.8397V26.1667H0.160156ZM19.0624 21.7917V10.125H20.5208V21.7917H19.0624ZM0.160156 7.20834V5.97437L12.4999 0.0849304L24.8397 5.97437V7.20834H0.160156ZM4.01355 5.75001H20.9863L12.4999 1.73959L4.01355 5.75001Z" fill="currentColor"/>
</svg></span>
    <span className="ms-4 fw-medium text-secondary">Universities</span></a>
  </li>
  <li data-bs-dismiss="offcanvas" className="nav-item">
    <Link to='/admin_report' className="nav-link" type="button"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 35 35" fill="none">
  <path d="M17.5002 23.9505C17.7544 23.9505 17.9676 23.8645 18.1396 23.6925C18.3116 23.5205 18.3976 23.3073 18.3976 23.0531C18.3976 22.7988 18.3116 22.5856 18.1396 22.4136C17.9676 22.2416 17.7544 22.1556 17.5002 22.1556C17.2459 22.1556 17.0327 22.2416 16.8607 22.4136C16.6887 22.5856 16.6027 22.7988 16.6027 23.0531C16.6027 23.3073 16.6887 23.5205 16.8607 23.6925C17.0327 23.8645 17.2459 23.9505 17.5002 23.9505ZM16.771 19.6316H18.2293V10.7694H16.771V19.6316ZM12.6484 29.1668L5.8335 22.3651V12.6484L12.6352 5.8335H22.3519L29.1668 12.6352V22.3519L22.3651 29.1668H12.6484ZM13.271 27.7085H21.7293L27.7085 21.7293V13.271L21.7293 7.29183H13.271L7.29183 13.271V21.7293L13.271 27.7085Z" fill="currentColor"/>
</svg></span>
    <span className="ms-4  fw-medium text-secondary">Reported Data</span></Link>
  </li>
  <li data-bs-dismiss="offcanvas" className="nav-item">
    <Link to='/reported_comments' className="nav-link"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 35 35" fill="none">
  <path d="M17.5002 23.9505C17.7544 23.9505 17.9676 23.8645 18.1396 23.6925C18.3116 23.5205 18.3976 23.3073 18.3976 23.0531C18.3976 22.7988 18.3116 22.5856 18.1396 22.4136C17.9676 22.2416 17.7544 22.1556 17.5002 22.1556C17.2459 22.1556 17.0327 22.2416 16.8607 22.4136C16.6887 22.5856 16.6027 22.7988 16.6027 23.0531C16.6027 23.3073 16.6887 23.5205 16.8607 23.6925C17.0327 23.8645 17.2459 23.9505 17.5002 23.9505ZM16.771 19.6316H18.2293V10.7694H16.771V19.6316ZM12.6484 29.1668L5.8335 22.3651V12.6484L12.6352 5.8335H22.3519L29.1668 12.6352V22.3519L22.3651 29.1668H12.6484ZM13.271 27.7085H21.7293L27.7085 21.7293V13.271L21.7293 7.29183H13.271L7.29183 13.271V21.7293L13.271 27.7085Z" fill="currentColor"/>
</svg></span>
    <span className="ms-4  fw-medium text-secondary">Comments</span></Link>
  </li>
  <li data-bs-dismiss="offcanvas" className="nav-item">
    <Link to='/pending_details' className="nav-link"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 29 21" fill="none">
  <path d="M0.786049 20.1475V17.7468C0.786049 17.07 0.961328 16.488 1.31189 16.001C1.66245 15.514 2.13355 15.1247 2.72519 14.8333C3.99013 14.231 5.24612 13.7509 6.49316 13.3928C7.74023 13.0348 9.24064 12.8558 10.9944 12.8558C12.7481 12.8558 14.2485 13.0348 15.4956 13.3928C16.7426 13.7509 17.9986 14.231 19.2636 14.8333C19.8552 15.1247 20.3263 15.514 20.6769 16.001C21.0274 16.488 21.2027 17.07 21.2027 17.7468V20.1475H0.786049ZM24.1194 20.1475V17.6795C24.1194 16.8344 23.9483 16.0367 23.6063 15.2864C23.2642 14.536 22.779 13.8922 22.1506 13.3549C22.8667 13.5008 23.5566 13.7032 24.2203 13.9621C24.8841 14.2211 25.5403 14.5123 26.1891 14.8357C26.8211 15.1536 27.3165 15.5603 27.6755 16.056C28.0345 16.5516 28.2139 17.0928 28.2139 17.6795V20.1475H24.1194ZM10.9944 9.60258C9.79126 9.60258 8.76131 9.17419 7.90454 8.31742C7.04777 7.46065 6.61938 6.4307 6.61938 5.22758C6.61938 4.02443 7.04777 2.99447 7.90454 2.1377C8.76131 1.28092 9.79126 0.852539 10.9944 0.852539C12.1975 0.852539 13.2275 1.28092 14.0842 2.1377C14.941 2.99447 15.3694 4.02443 15.3694 5.22758C15.3694 6.4307 14.941 7.46065 14.0842 8.31742C13.2275 9.17419 12.1975 9.60258 10.9944 9.60258ZM21.5954 5.22758C21.5954 6.4307 21.167 7.46065 20.3102 8.31742C19.4534 9.17419 18.4235 9.60258 17.2204 9.60258C17.1587 9.60258 17.0801 9.59556 16.9848 9.58154C16.8894 9.56752 16.8109 9.55209 16.7492 9.53527C17.2432 8.93019 17.6228 8.25893 17.8881 7.5215C18.1534 6.78407 18.286 6.01826 18.286 5.22408C18.286 4.42992 18.1472 3.67106 17.8696 2.94751C17.5919 2.22396 17.2185 1.54807 16.7492 0.919841C16.8277 0.891817 16.9062 0.873588 16.9848 0.865154C17.0633 0.856744 17.1418 0.852539 17.2204 0.852539C18.4235 0.852539 19.4534 1.28092 20.3102 2.1377C21.167 2.99447 21.5954 4.02443 21.5954 5.22758ZM2.24438 18.6891H19.7444V17.7468C19.7444 17.4046 19.6588 17.1055 19.4878 16.8494C19.3167 16.5932 19.0096 16.3483 18.5665 16.1146C17.4784 15.5331 16.3313 15.0877 15.1254 14.7782C13.9195 14.4688 12.5425 14.3141 10.9944 14.3141C9.44631 14.3141 8.0693 14.4688 6.86336 14.7782C5.65744 15.0877 4.51041 15.5331 3.42228 16.1146C2.97916 16.3483 2.67206 16.5932 2.50098 16.8494C2.32991 17.1055 2.24438 17.4046 2.24438 17.7468V18.6891ZM10.9944 8.14424C11.7965 8.14424 12.4831 7.85865 13.0543 7.28747C13.6255 6.71629 13.911 6.02966 13.911 5.22758C13.911 4.42549 13.6255 3.73886 13.0543 3.16768C12.4831 2.5965 11.7965 2.31091 10.9944 2.31091C10.1923 2.31091 9.50567 2.5965 8.93449 3.16768C8.36331 3.73886 8.07772 4.42549 8.07772 5.22758C8.07772 6.02966 8.36331 6.71629 8.93449 7.28747C9.50567 7.85865 10.1923 8.14424 10.9944 8.14424Z" fill="currentColor"/>
</svg></span>
    <span className="ms-4  fw-medium text-secondary">Pending Data</span></Link>
  </li>
  <li data-bs-dismiss="offcanvas" className="nav-item">
    <p onClick={()=>{
      logout()
    }} style={{cursor:'pointer'}} className="nav-link"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
  <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg></span>
    <span className="ms-4  fw-medium text-secondary">Logout</span></p>
  </li>
</ul>
          </div>
  
        </div>
      </div>
    </div>
  )
}

export default Admin_navbar
