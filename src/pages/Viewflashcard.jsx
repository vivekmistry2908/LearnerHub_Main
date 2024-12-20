import React, { useEffect, useState,useContext } from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ipaddress2 } from '../App'
import Create_flashcard_study_list from './Create_Flashcard_study_list'
import Backtotop from './Backtotop'
import { Context } from '../context/Context_provider'
import Navpath from './Navpath'
import { toast } from 'react-toastify'
import axiosInstance from './axiosInstance'
import 'bootstrap';
import * as bootstrap from 'bootstrap';
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');

const Viewflashcard = () => {

  const {id}=useParams()
  const {type}=useParams()

  const navigate=useNavigate()
  let {translate_value,addsubjects_layout,setgroup_visible,setstudylist_visible,setcourse_visible,navbar_dropdown_visible,setnavbar_dropdown_visible}=useContext(Context)

  let {flashset_id}=useParams()
  const[Flashset,setFlashset]=useState({})
  const[count,setCount]=useState(0)
  const[dropdownstate,setDropdownstate]=useState(false)
const user=JSON.parse(sessionStorage.getItem('user'))
  useEffect(()=>{
    axiosInstance.get(`${ipaddress2}/flashcardsList/${flashset_id}/${user.user_id}/`)
    .then((r)=>{
    //  console.log("Particular Flashset details Fetched",r.data)
     setFlashset(r.data)
    })
    .catch(()=>{
     console.log("Particular Flashset details Fetching Error")
    })
},[count])

// -----------------------------------------------Set Path----------------------------------------------------------------
sessionStorage.setItem('name3',JSON.stringify("View Flashset"))
sessionStorage.setItem('path3',JSON.stringify(`/viewflashcard/${type}/${id}/${flashset_id}`))
// ----------------------To like the particular flashset-------------------------------------
const likeFlashset=()=>{
  axiosInstance.post(`${ipaddress2}/flashsetlikes/${user.user_id}/${flashset_id}/`)
  .then((r)=>{
    // console.log("Flashset Succesfully Liked",r.data)
    setCount(count+1)
  })
  .catch(()=>{
    console.log("Flashset like error")
  })
  }

// -------------------------------------To bookmark the flashcard under particular flashset---------------------------------

const likeFlashcard=(flashcardId)=>{
axiosInstance.post(`${ipaddress2}/BookmarkFlashcard/${user.user_id}/${flashcardId}/`)
.then((r)=>{
  // console.log("Flashcard Succesfully Bookmarked",r.data)
  setCount(count+1)
})
.catch(()=>{
  console.log("Flashcard like error")
})
}

// -----------------------------------Functionality to Delete the Flashcard-------------------------------------------------

const deleteFlashcard=(flashcardId)=>{
  axiosInstance.post(`${ipaddress2}/Delete_flashcard/`,{
    'user_id':user.user_id,
    'flashcard_id': flashcardId
  })
  .then((r)=>{
    // console.log("Flashcard Succesfully Deleted",r.data)
    setCount(count+1)
  })
  .catch(()=>{
    console.log("Flashcard delete error")
  })
  }

  // ------------------------------To Report the Flashset-----------------------------

const[reportdropdownstate,setreportdropdownstate]=useState(false)
const[reportvalue,setReportvalue]=useState("")

const reportCourse=()=>{
  const report=new FormData()
  report.append('user_id',user.user_id)
  report.append('flashset_id',flashset_id)
  report.append('user_report',reportvalue)
  axiosInstance.post(`${ipaddress2}/FlashsetReport/`,report)
  .then((r)=>{
    console.log("Flashset Reported Successfully",r.data)
  //   }
  toast.warn('Successfully reported',{
    autoClose:2000,
  })
    setreportdropdownstate(false)
    setCount(count+1)
    // fetchcoursedetails()
    
  })
}
  
// ----------------------------------------------Functionality to Unsave the Flashset--------------------------------------
const unsave=()=>{
  axiosInstance.put(`${ipaddress2}/Unsave_flashcard_studylist/${user.user_id}/${flashset_id}/`)
  .then((r)=>{
    console.log("Flashset successfully unsaved",r.data)
    setCount(count+1)
  })
  .catch((err)=>{
    console.log("Unsave error",err)
  })
}

// ----------------------------------------------Functionality to Dislike the Flashset--------------------------------------
const dislikeFlashset=()=>{
  axiosInstance.post(`${ipaddress2}/FlashsetDislikeView/${user.user_id}/${flashset_id}/`)
  .then((r)=>{
    console.log("Flashset successfully disliked",r.data)
    setCount(count+1)
  })
  .catch((err)=>{
    console.log("Dislike error",err)
  })
}


// ------------------------------------------------Change the scope of Flashset-------------------------------------------------
const[scope_status,setscope_status]=useState(false)
const[scope,setscope]=useState("change")

const changeScope=()=>{
  axiosInstance.post(`${ipaddress2}/Change_scope/`,{
    'flashset_id':flashset_id,
    'scope':scope
  })
  .then((r)=>{
    console.log("Flashset scope changed",r.data)
    setCount(count+1)
    setscope_status(true)
    setscope("change")
    navigate('/dashboard/page')
  })
  .catch((err)=>{
    console.log("Flashset scope changig error",err)
  })
}

useEffect(()=>{
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // Cleanup function to destroy tooltips when the component unmounts
  return () => {
    tooltipList.forEach((tooltip) => {
      tooltip.dispose();
    })}
},[])


return (
  <div>
    <div className='d-flex' style={{position:'relative'}}>
        <Mainsidebar count={count}/>
        <div onClick={()=>{
            setcourse_visible(false)
            setgroup_visible(false)
            setstudylist_visible(false)
          }} className="w-100 pt-5 mt-2 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
            <Navbar count={count}/>
            <div onClick={()=>{
              setnavbar_dropdown_visible(false)
            }} className="w-100 pb-3 pt-4 px-1 ps-md-3 ps-lg-5 pe-2 pe-lg-4 mt-1 d-flex flex-column" id='subject-div' style={{backgroundColor:'#F3F0FF'}}>
                        {/* <div className=''> */}
  
  <div className='d-flex justify-content-between py-2'>
    <Navpath/>

    <div className='text-end mt-3'>
{/* ---------------------------------------------REPORT THE SUBJECT--------------------------------------------------- */}
<div className="d-inline">
<span className={`ms-4 ps-2`} style={{cursor:'pointer',position:'relative',color:'#5D60E1'}} onClick={()=>{
  setreportdropdownstate(!reportdropdownstate)
}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-octagon" viewBox="0 0 16 16">
<path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z"/>
<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
</svg></span>
<ul className={`${reportdropdownstate ? '':'d-none'} rounded me-5 bg-white border-0 py-2 mt-3 px-2 ps-3 report-dropdown`} style={{width:'180px',listStyleType:'none',position:'absolute',right:'40px',top:'115px'}}>
<li><a data-bs-toggle="modal" data-bs-target="#reportflashsetmodal" className={`dropdown-item d-flex align-items-center ${Flashset.Flashsetreport_status ? 'd-none':''}`} href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-octagon" viewBox="0 0 16 16">
<path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z"/>
<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
</svg> <span className='ms-2'>Report Irrelevant</span></a></li>

<li className='mt-2'><a data-bs-toggle="modal" data-bs-target="#reportflashsetmodal" className={`dropdown-item d-flex align-items-center ${Flashset.Flashsetreport_status ? 'd-none':''}`} href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16">
<path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
</svg> <span className='ms-2'>Report Invalid</span></a></li>

<li className={`${Flashset.Flashsetreport_status ? '':'d-none'}`} style={{color:'#ff845d'}}><a className="dropdown-item d-flex align-items-center" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16">
<path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
</svg> <span className='ms-2'>Already Reported</span></a></li>
</ul>
</div>

<span className='ms-4 ps-2'><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#5D5FE3" className="bi bi-share" viewBox="0 0 16 16">
  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
</svg></span>
                        </div>
  </div>
                        
                        <h5 onClick={()=>{
  setreportdropdownstate(false)
}} className='fw-bold d-flex align-items-center' style={{color:'#2A3941'}}>
                          <svg className={`${Flashset.scope=== "private" ? '':'d-none'}`} xmlns="http://www.w3.org/2000/svg" width="15" height="19" viewBox="0 0 15 19" fill="none">
  <path d="M1.89093 18.875C1.42819 18.875 1.03206 18.7102 0.702549 18.3807C0.373018 18.0512 0.208252 17.6551 0.208252 17.1923V8.05768C0.208252 7.59494 0.373018 7.19881 0.702549 6.8693C1.03206 6.53977 1.42819 6.375 1.89093 6.375H3.33325V4.29167C3.33325 3.13115 3.73757 2.14657 4.54619 1.33794C5.35482 0.529315 6.3394 0.125 7.49992 0.125C8.66044 0.125 9.64501 0.529315 10.4536 1.33794C11.2623 2.14657 11.6666 3.13115 11.6666 4.29167V6.375H13.1089C13.5716 6.375 13.9678 6.53977 14.2973 6.8693C14.6268 7.19881 14.7916 7.59494 14.7916 8.05768V17.1923C14.7916 17.6551 14.6268 18.0512 14.2973 18.3807C13.9678 18.7102 13.5716 18.875 13.1089 18.875H1.89093ZM7.49992 14.1875C7.93929 14.1875 8.30955 14.0369 8.6107 13.7358C8.91185 13.4346 9.06242 13.0644 9.06242 12.625C9.06242 12.1856 8.91185 11.8154 8.6107 11.5142C8.30955 11.2131 7.93929 11.0625 7.49992 11.0625C7.06054 11.0625 6.69028 11.2131 6.38914 11.5142C6.08799 11.8154 5.93742 12.1856 5.93742 12.625C5.93742 13.0644 6.08799 13.4346 6.38914 13.7358C6.69028 14.0369 7.06054 14.1875 7.49992 14.1875ZM4.37492 6.375H10.6249V4.29167C10.6249 3.42361 10.3211 2.68576 9.71346 2.07812C9.10582 1.47049 8.36797 1.16667 7.49992 1.16667C6.63186 1.16667 5.89402 1.47049 5.28638 2.07812C4.67874 2.68576 4.37492 3.42361 4.37492 4.29167V6.375Z" fill="#2A3941"/>
</svg>
<svg className={`${Flashset.scope=== "private" ? 'd-none':''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-unlock-fill" viewBox="0 0 16 16">
  <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2"/>
</svg><span className='ms-2'>{Flashset.name}</span></h5>
                        {/* </div> */}
                        <div onClick={()=>{
  setreportdropdownstate(false)
}} className='d-flex gap-4 mt-2 pb-2 align-items-center' style={{color:'#2A3941'}}>
                            <span style={{cursor:'pointer'}} className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M18.1892 19.9922H7.73242V8.53383L14.2629 2.08352L14.7236 2.54424C14.8184 2.63907 14.8982 2.7606 14.963 2.90883C15.0278 3.05707 15.0602 3.1933 15.0602 3.3175V3.48174L13.9945 8.53383H21.234C21.6694 8.53383 22.0587 8.70544 22.4019 9.04867C22.7451 9.39188 22.9167 9.78117 22.9167 10.2165V11.4986C22.9167 11.5934 22.9061 11.6969 22.8847 11.8091C22.8633 11.9213 22.8353 12.0248 22.8006 12.1196L19.956 18.8624C19.8131 19.1829 19.5727 19.4513 19.2348 19.6677C18.897 19.884 18.5484 19.9922 18.1892 19.9922ZM8.77409 18.9505H18.1892C18.3361 18.9505 18.4863 18.9105 18.6399 18.8303C18.7934 18.7502 18.9103 18.6166 18.9904 18.4297L21.8751 11.6589V10.2165C21.8751 10.0296 21.815 9.876 21.6948 9.75581C21.5746 9.63562 21.421 9.57552 21.234 9.57552H12.7004L13.9063 3.88641L8.77409 8.97854V18.9505ZM7.73242 8.53383V9.57552H4.16672V18.9505H7.73242V19.9922H3.12506V8.53383H7.73242Z" fill="#2A3941"/>
</svg> <span className='ms-2' style={{fontSize:'14px'}}>{Flashset.upvote_count} Upvotes</span></span>
                    {Flashset && Flashset.flashcards_data && (<span  className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M4.50123 21.146L4.29691 21.0618C3.74536 20.8228 3.3751 20.4255 3.18612 19.8699C2.99715 19.3144 3.02419 18.7742 3.26724 18.2493L4.50123 15.5891V21.146ZM9.46917 22.7966C8.89626 22.7966 8.4058 22.5926 7.99782 22.1846C7.58983 21.7766 7.38584 21.2862 7.38584 20.7133V16.5867L9.38506 22.1195C9.43714 22.2544 9.48922 22.3749 9.54131 22.4811C9.59339 22.5873 9.66284 22.6924 9.74964 22.7966H9.46917ZM13.5116 21.8511C13.2365 21.966 12.9654 21.9499 12.6983 21.803C12.4313 21.6561 12.2403 21.4384 12.1254 21.15L7.49001 8.44164C7.37516 8.16654 7.38585 7.89444 7.52206 7.62534C7.65828 7.35622 7.86394 7.16625 8.13904 7.05542L16.0036 4.19083C16.2787 4.07597 16.5432 4.092 16.7969 4.23891C17.0507 4.38582 17.235 4.6035 17.3498 4.89195L21.9852 17.5602C22.1001 17.8487 22.0994 18.1308 21.9832 18.4066C21.867 18.6824 21.6647 18.8757 21.3762 18.9865L13.5116 21.8511ZM11.6326 10.4168C11.9278 10.4168 12.1752 10.317 12.3748 10.1173C12.5745 9.91767 12.6743 9.67027 12.6743 9.37513C12.6743 9.07999 12.5745 8.8326 12.3748 8.63294C12.1752 8.43329 11.9278 8.33346 11.6326 8.33346C11.3375 8.33346 11.0901 8.43329 10.8904 8.63294C10.6908 8.8326 10.591 9.07999 10.591 9.37513C10.591 9.67027 10.6908 9.91767 10.8904 10.1173C11.0901 10.317 11.3375 10.4168 11.6326 10.4168ZM13.1431 20.8335L21.0076 17.9689L16.3722 5.20846L8.50764 8.07305L13.1431 20.8335Z" fill="#2A3941"/>
</svg> <span className='ms-2' style={{fontSize:'14px'}}>{Flashset.flashcards_data.length} Flashcards</span></span>
                    )}
<span  className={`d-flex align-items-center`}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M5.84931 21.8752C5.36988 21.8752 4.96958 21.7146 4.6484 21.3934C4.32722 21.0722 4.16663 20.6719 4.16663 20.1925V6.89117C4.16663 6.41174 4.32722 6.01144 4.6484 5.69026C4.96958 5.36908 5.36988 5.20849 5.84931 5.20849H7.69225V2.88477H8.81405V5.20849H16.266V2.88477H17.3077V5.20849H19.1506C19.63 5.20849 20.0303 5.36908 20.3515 5.69026C20.6727 6.01144 20.8333 6.41174 20.8333 6.89117V20.1925C20.8333 20.6719 20.6727 21.0722 20.3515 21.3934C20.0303 21.7146 19.63 21.8752 19.1506 21.8752H5.84931ZM5.84931 20.8335H19.1506C19.3109 20.8335 19.4578 20.7667 19.5913 20.6332C19.7249 20.4996 19.7916 20.3527 19.7916 20.1925V11.0578H5.20829V20.1925C5.20829 20.3527 5.27506 20.4996 5.40861 20.6332C5.54216 20.7667 5.68907 20.8335 5.84931 20.8335ZM5.20829 10.0162H19.7916V6.89117C19.7916 6.73093 19.7249 6.58403 19.5913 6.45047C19.4578 6.31693 19.3109 6.25016 19.1506 6.25016H5.84931C5.68907 6.25016 5.54216 6.31693 5.40861 6.45047C5.27506 6.58403 5.20829 6.73093 5.20829 6.89117V10.0162Z" fill="#2A3941"/>
</svg> {Flashset.created_on!=undefined ? (<span className='ms-2' style={{fontSize:'14px'}}>{Flashset.created_on.slice(0,10)}</span>):(<></>)}</span>
                        </div>
                        <div className='mt-4 d-flex align-items-center'>
               <p id='flashsetusernamepara' className='rounded-circle text-white fw-medium my-auto'>MN</p>
                <span className='ms-2' style={{color:'#6668e5',fontSize:'14px'}}>By {Flashset.nickname}</span>
                        </div>
                    </div>
            <div onClick={()=>{
  setreportdropdownstate(false)
}} className="w-100 px-1 px-lg-4">
 

{/* Flashcard description view */}

<div className="modal fade" id="viewdescription" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className='d-flex flex-column gap-3 py-3'>
            <a href="">University</a><a href="">University</a><a href="">University</a><a href="">University</a>
        </div>
      </div>
    </div>
  </div>
</div>

                <div onClick={()=>{
  setreportdropdownstate(false)
}} className='p-0 p-lg-4 bg-white'>
                  <div className='d-md-flex justify-content-between align-items-center pb-4 mt-3'>
                  <h5>{Flashset.name}</h5>
                <div className='d-flex gap-2'>
                  <select value={scope} className={`rounded px-2 shadow-none ${Flashset.scope=== "private" && type!=="group" ? '':'d-none'}`} style={{border:'1px solid #5d5fe3'}} name="" id="" onChange={(e)=>{
                    setscope(e.target.value)
                    setscope_status(true)
                  }}>
                    <option value="change">Change the scope</option>
                    <option value="public">Public</option>
                  </select>
                  <Link to={`/filterflashcard/${type}/${id}/${flashset_id}`} className='text-white fw-medium btn' style={{backgroundColor:'#5d5fe3',fontSize:'14px'}}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M12.4599 19.5112C11.6132 18.9316 10.7104 18.4862 9.75153 18.1751C8.79266 17.8639 7.79907 17.7083 6.77075 17.7083C6.22855 17.7083 5.69603 17.7537 5.1732 17.8446C4.65035 17.9354 4.1412 18.0809 3.64575 18.2812C3.26782 18.4322 2.91291 18.3901 2.58104 18.1551C2.24918 17.92 2.08325 17.5962 2.08325 17.1835V7.15544C2.08325 6.8977 2.15436 6.66533 2.29659 6.45833C2.43881 6.25134 2.62544 6.10444 2.85648 6.01763C3.46813 5.74786 4.10448 5.54553 4.76554 5.41065C5.4266 5.27577 6.09501 5.20833 6.77075 5.20833C7.79105 5.20833 8.77963 5.36525 9.73651 5.67909C10.6934 5.99293 11.6145 6.41026 12.4999 6.93109V18.2532C13.372 17.6976 14.2975 17.2943 15.2764 17.0433C16.2553 16.7922 17.2395 16.6667 18.2291 16.6667C18.8007 16.6667 19.3192 16.6987 19.7846 16.7628C20.25 16.8269 20.7465 16.9364 21.274 17.0914C21.4209 17.1314 21.5578 17.1347 21.6846 17.1014C21.8115 17.068 21.8749 16.9578 21.8749 16.7708V5.87339C21.9751 5.89342 22.0709 5.92114 22.1624 5.95654C22.2539 5.99192 22.341 6.03899 22.4238 6.09776C22.5881 6.18457 22.7113 6.30809 22.7934 6.46833C22.8755 6.62859 22.9166 6.80421 22.9166 6.99518V17.1434C22.9166 17.5561 22.7406 17.8766 22.3887 18.105C22.0369 18.3333 21.6519 18.3788 21.2339 18.2412C20.7518 18.0542 20.2593 17.9187 19.7565 17.8345C19.2537 17.7504 18.7446 17.7083 18.2291 17.7083C17.1874 17.7083 16.1738 17.8539 15.1882 18.1451C14.2027 18.4362 13.2932 18.8916 12.4599 19.5112ZM14.5833 15.625V6.77083L19.7916 1.5625V10.9375L14.5833 15.625ZM11.4583 17.7584V7.54607C10.7251 7.14275 9.96686 6.82591 9.18362 6.59555C8.40035 6.36518 7.59606 6.25 6.77075 6.25C6.12839 6.25 5.53344 6.30742 4.98591 6.42227C4.43836 6.53713 3.94489 6.6827 3.50552 6.85898C3.39868 6.89904 3.30854 6.95579 3.2351 7.02924C3.16165 7.1027 3.12492 7.19285 3.12492 7.29969V16.8169C3.12492 17.0039 3.18836 17.1141 3.31523 17.1474C3.44209 17.1808 3.57897 17.1708 3.72588 17.1174C4.14656 16.9718 4.60296 16.8603 5.09508 16.7829C5.58719 16.7054 6.14575 16.6667 6.77075 16.6667C7.70291 16.6667 8.57863 16.7755 9.39794 16.9932C10.2173 17.2109 10.904 17.4659 11.4583 17.7584Z" fill="white"/>
</svg><span className='ms-2'>Study Now</span></Link>
<button data-bs-toggle="modal" data-bs-target="#flashcard_studylist_modal" className={`fw-medium btn ${Flashset.studylist_status ? 'd-none':''}`} style={{border:'1px solid #5d5fe3',fontSize:'14px',color:'#5d5fe3',backgroundColor:'#fff'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
</svg><span className='ms-2'>Save
  </span></button>
  <button onClick={()=>{
    unsave()
  }} className={`fw-medium btn ${Flashset.studylist_status ? '':'d-none'}`} style={{border:'1px solid #5d5fe3',fontSize:'14px',color:'#fff',backgroundColor:'#5d5fe3'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
</svg><span className='ms-2'>Saved
  {/* {Flashset.studylist_status ? 'Saved' : 'Save'} */}
  </span></button>
<button className='fw-medium btn d-flex align-items-center' onClick={likeFlashset} style={{border:'1px solid #5d5fe3',fontSize:'14px',color:Flashset.upvote ? '#ff845d':'#5d5fe3'}}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M18.1892 19.9922H7.73242V8.53383L14.2629 2.08352L14.7236 2.54424C14.8184 2.63907 14.8982 2.7606 14.963 2.90883C15.0278 3.05707 15.0602 3.1933 15.0602 3.3175V3.48174L13.9945 8.53383H21.234C21.6694 8.53383 22.0587 8.70544 22.4019 9.04867C22.7451 9.39188 22.9167 9.78117 22.9167 10.2165V11.4986C22.9167 11.5934 22.9061 11.6969 22.8847 11.8091C22.8633 11.9213 22.8353 12.0248 22.8006 12.1196L19.956 18.8624C19.8131 19.1829 19.5727 19.4513 19.2348 19.6677C18.897 19.884 18.5484 19.9922 18.1892 19.9922ZM8.77409 18.9505H18.1892C18.3361 18.9505 18.4863 18.9105 18.6399 18.8303C18.7934 18.7502 18.9103 18.6166 18.9904 18.4297L21.8751 11.6589V10.2165C21.8751 10.0296 21.815 9.876 21.6948 9.75581C21.5746 9.63562 21.421 9.57552 21.234 9.57552H12.7004L13.9063 3.88641L8.77409 8.97854V18.9505ZM7.73242 8.53383V9.57552H4.16672V18.9505H7.73242V19.9922H3.12506V8.53383H7.73242Z" fill="currentColor"/>
</svg> <span className='ms-1'>{Flashset.upvote_count}</span></button>
<button className='fw-medium btn' onClick={()=>{
  dislikeFlashset()
}} style={{border:'1px solid #5d5fe3',fontSize:'14px',color:Flashset.disupvote ? '#FF845D':'#5d5fe3'}}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M6.81083 5.00781H17.2676V16.4662L10.7371 22.9165L10.2764 22.4558C10.1816 22.3609 10.1018 22.2394 10.037 22.0912C9.97223 21.9429 9.93984 21.8067 9.93984 21.6825V21.5183L11.0055 16.4662H3.76596C3.3306 16.4662 2.94131 16.2946 2.5981 15.9513C2.25487 15.6081 2.08325 15.2188 2.08325 14.7835V13.5014C2.08325 13.4066 2.09395 13.3031 2.11534 13.1909C2.13669 13.0787 2.16473 12.9752 2.19945 12.8804L5.04401 6.13763C5.18691 5.81711 5.42729 5.54868 5.76515 5.33234C6.10304 5.11599 6.45159 5.00781 6.81083 5.00781ZM16.2259 6.04948H6.81083C6.66394 6.04948 6.5137 6.08955 6.36013 6.16969C6.20655 6.24981 6.08969 6.38335 6.00955 6.57031L3.12494 13.3411V14.7835C3.12494 14.9704 3.18504 15.124 3.30523 15.2442C3.42542 15.3644 3.579 15.4245 3.76596 15.4245H12.2996L11.0937 21.1136L16.2259 16.0215V6.04948ZM17.2676 16.4662V15.4245H20.8333V6.04948H17.2676V5.00781H21.8749V16.4662H17.2676Z" fill="currentColor"/>
</svg></button>
                </div>
                  </div>
                  <div className='row m-0'>
                  <h6 className='col-5' style={{color:'#5d5fe3'}}>Term</h6>
                  <h6 className='col-5' style={{color:'#5d5fe3'}}>Definition</h6>
                  </div>
                 
    {Flashset.flashcards_data ? (
                  Flashset.flashcards_data.map((x)=>{
                    return(
                      <div className="row border bg-white m-0 mt-3 rounded">
                          <div className="col-md-5  py-4 border-0 border-end">
                            <div data-bs-toggle="tooltip" data-bs-placement="right"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Term" className='d-flex justify-content-between'>
                            <p style={{fontSize:'14px'}} className=''>{x.term}</p>
                             {x.t_image_url!==null && (<img src={x.t_image_url} width={90} className='rounded' alt="" />)}
                            </div>
                          </div>
                          <div className="col-md-6 ps-lg-4 py-4" style={{backgroundColor:'#E2E3E5'}}>
                              
                          <div data-bs-toggle="tooltip" data-bs-placement="right"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Definition" className='d-flex justify-content-between'>
                              <span style={{fontSize:'14px'}}>{x.definition}</span>
                             {x.d_image_url!==null && (<img src={x.d_image_url} width={80} className='rounded' alt="" />)}
                              </div>
                          </div>
                          <div className="col-md-1 d-flex justify-content-end py-4  align-items-center">
                            <button className='border-0 bg-transparent' onClick={()=>{
                              likeFlashcard(x.flashcard_id)
                            }}>
                            <i className={x.bookmark_status ? "fa-solid fa-bookmark":"fa-regular fa-bookmark"} style={{color:x.bookmark_status ? "#ff855f":""}}></i>
                            </button>
                            {Flashset && Flashset.scope==="private" ? (<button onClick={()=>{
                              deleteFlashcard(x.flashcard_id)
                            }} className='bg-transparent border-0 d-flex ms-4'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>
                            </button>):(<></>)}
                          </div>
  
                      </div>
                    )
                  })
                ) : (
                  <p>Loading.....</p>
                )}
                
                    
                </div>
           
            </div>
        </div>


{Flashset && Flashset.scope==="private" ? (
  <Link to={`/add_additional_flashcard/${type}/${id}/${flashset_id}`} style={{position:'fixed',left:'93%',top:'92%'}} 
  // onClick={()=>{
  //   navigate(`/add_additional_flashcard/${flashset_id}`)
  // }} 
  className='bg-transparent border-0 text-primary '>
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
</svg>
  </Link>):(<></>)}
        
{/* ----------------------------------------------Create Flashcard Study list layout form------------------------------- */}
<Create_flashcard_study_list setCount={setCount} flashset_id={flashset_id}/>

<Backtotop/>

{/* TOAST MESSAGE */}
<div className="toast-container position-fixed bottom-0 end-0 p-3">
<div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
  
  <div className="toast-body d-flex justify-content-between align-items-center">
    <span id='toastbody' className='fw-medium p-2'></span> 
    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
</div>
</div>
</div>


<div className={`${scope_status ? 'animate__animated animate__fadeIn':'d-none'}`} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',backgroundColor:'rgb(0,0,0,0.7)',zIndex:6}}>
<div className='bg-white w-50 rounded py-3 px-3 mx-auto mt-3'>
          <p className='m-0 mb-2 ms-3'>Are you surely want to change the scope to public? This will really help others.</p>
          <div className='text-end'>
            <button className='btn btn-sm text-white px-3' style={{backgroundColor:'#5d5fe3'}} onClick={()=>{
              changeScope()
            }}>Yes</button>
            <button className='btn btn-sm text-white ms-3 px-3' style={{backgroundColor:'#5d5fe3'}} onClick={()=>{
              setscope("change")
              setscope_status(false)
            }}>No</button>
            
          </div>
        </div>
</div>

<div className="modal fade" id="reportflashsetmodal" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
<div className="modal-dialog modal-md">
  <div className="modal-content">
    <div className="modal-body pt-4 pb-3">
      <div>
        <label htmlFor="" className='fw-medium text-dark'>⚠ Report the Flashset</label>
        <textarea onChange={(e)=>{
          setReportvalue(e.target.value)
        }} className='form-control shadow-sm mt-2 py-3'></textarea>
      </div>
      <div className='mt-3 text-end'>
        <button className='btn btn-sm rounded-pill text-white fw-medium px-4' style={{backgroundColor:'#5d5fe3'}} data-bs-dismiss="modal" onClick={reportCourse}>Send</button>
      </div>
    </div>
  </div>
</div>
</div>
  </div>
  )
}

export default Viewflashcard