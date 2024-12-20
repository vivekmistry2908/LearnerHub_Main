import React, { useState,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ipaddress } from '../App'
import { Context } from '../context/Context_provider'
import axiosInstance from './axiosInstance'

const Globalsearch = () => {

  const {translate_value,setCount4}=useContext(Context)
  const user=JSON.parse(sessionStorage.getItem('user'))
  const[searchdata,setSearchdata]=useState("")
  const[AvailablecourseData,setAvailableCourseData]=useState({})
  const[JoinedcourseData,seJoinedCourseData]=useState({})
  const[documentData,setdocumentData]=useState({})
  const[flashcardData,setFlashcardData]=useState({})
  const[status,setstatus]=useState(false)
  const globalsearch=(value)=>{
    if(value.length>0){
    axiosInstance.get(`${ipaddress}/DocumentSearch/${value}/${user.user_id}/`)
    .then((r)=>{
      setstatus(true)
      // console.log("Global Search Data Found",r.data)
      setAvailableCourseData(r.data[0])
      seJoinedCourseData(r.data[1])
      setdocumentData(r.data[2])
      setFlashcardData(r.data[3])
    })
    .catch(()=>{
      // console.log("Global Search Error")
    })
  }
  else{
    setstatus(false)
  }
  }

  const joinCourse=(course_id)=>{
    axiosInstance.post(`${ipaddress}/join-course/${user.user_id}/${course_id}/`)
    .then((r)=>{
      setAvailableCourseData({})
      seJoinedCourseData({})
      setdocumentData({})
      setFlashcardData({})
      setSearchdata("")
      setCount4((prev)=>prev+1)
      // setCount(count+1)
    // window.location.reload()
//     const toastLiveExample = document.getElementById('liveToast')
//               document.getElementById('toastbody').textContent="Successfully Joined in the Course"
// const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
//   toastBootstrap.show()
  // setSearchedSubjects([])
  // setSearchvalue("")
    })
    .catch(()=>{
      // console.log("Course Joining error")
    })
}

const navigate=useNavigate()

  return (
    
    <div>
<div className="offcanvas offcanvas-top" data-bs-backdrop="static" tabindex="-1"  id="searchoffcanvas" aria-labelledby="searchoffcanvasLabel" style={{height:'300px'}}>
  <div className="offcanvas-body">
    <div className='d-flex justify-content-between border-bottom pb-3 pt-2 px-1 px-lg-5 align-items-center'>
    <div className="input-group">
  <span className="input-group-text bg-white border-end-0 border-0" style={{color:'#AAB0B0'}} id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg></span>
  <input type="text" className="form-control nav-input border-start-0 border-0" value={searchdata} onChange={(e)=>{
    setSearchdata(e.target.value)
    globalsearch(e.target.value)
  }} id='globalsearch' placeholder={translate_value.dashboard.global_search} aria-label="Username" aria-describedby="basic-addon1"/>
</div>
<svg type="button" data-bs-dismiss="offcanvas" aria-label="Close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FF845D" className="bi bi-x-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>
    </div>

    
  <div className={`container mt-4 ${status ? '':'d-none'}`}>
  {documentData.documents &&(
      documentData.documents.map((x)=>{
        return(
          <>
          <p><span className='p-1 rounded-pill px-2' style={{backgroundColor:'#FFF0EB',border:'1px solid #FFCEBF',fontSize:'14px'}}>Document</span> <button data-bs-dismiss="offcanvas" onClick={()=>{
            navigate(`/showpdf/${x.document_id}`)
          }} className='ms-2 ms-lg-3 text-decoration-underline bg-transparent border-0' style={{color:'#5D5FE3',cursor:'pointer',fontSize:'15px'}}>{x.title}</button></p>
          </>
        )
      })
    )}
{AvailablecourseData.courses &&(
      AvailablecourseData.courses.map((x)=>{
        return(
          <div className='d-flex mb-2 justify-content-between'>
             <p className='m-0'><span className='p-1 rounded-pill px-3' style={{backgroundColor:'#CFF4D2',border:'1px solid #8BDAC8',fontSize:'14px'}}>Subjects</span> <Link className='ms-2 ms-lg-3 text-decoration-underline' style={{color:'#5D5FE3',cursor:'pointer',fontSize:'15px'}}>{x.course_name}</Link></p>
             <button data-bs-dismiss="offcanvas" onClick={()=>{
             joinCourse(x.course_id)
           }} className='btn btn-sm border border-primary-subtle px-3 py-1 fw-medium text-decoration-none d-flex align-items-center' style={{height:'30px',color:'#8587EA',fontSize:'14px'}}>{translate_value.common_words.join}</button>
          </div>
        )
      })
    )}


{JoinedcourseData.joinedcourses &&(
      JoinedcourseData.joinedcourses.map((x)=>{
        return(
          <div className='d-flex justify-content-between'>
             <div>
             <p className=''><span className='p-1 rounded-pill px-3' style={{backgroundColor:'#CFF4D2',border:'1px solid #8BDAC8',fontSize:'14px'}}>Subjects</span> <button data-bs-dismiss="offcanvas" onClick={()=>{
            navigate(`/subjects/${x.course_id}/${x.course_name}`)
          }} className='bg-transparent border-0 ms-2 ms-lg-3 text-decoration-underline' style={{color:'#5D5FE3',cursor:'pointer',fontSize:'15px'}}>{x.course_name}</button></p>
             </div>

<button disabled className='btn btn-sm border text-white px-3 py-1 fw-medium text-decoration-none d-flex align-items-center' style={{backgroundColor:'#5D5FE3', height:'30px',color:'#ffff',fontSize:'14px'}}>Joined</button>
             </div>
        )
      })
    )}

{flashcardData.flashsets &&(
      flashcardData.flashsets.map((x)=>{
        return(
          <>
          <p><span className='p-1 rounded-pill px-2' style={{backgroundColor:'#fffae0',border:'1px solid #fbefac',fontSize:'14px'}}>Flashcard</span> <Link data-bs-dismiss="offcanvas" onClick={()=>{
            navigate(`/viewflashcard/'search'/""/${x.flashset_id}`)
          }} className='ms-2 ms-lg-3 text-decoration-underline' style={{color:'#5D5FE3',cursor:'pointer',fontSize:'15px'}}>{x.name}</Link></p>
          </>
        )
      })
    )}
  </div>
  </div>
</div>
    </div>
  )
}

export default Globalsearch