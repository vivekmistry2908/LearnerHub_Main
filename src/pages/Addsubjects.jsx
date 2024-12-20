// After successfull signup this add modules page will open only once, here the user can select and join in any modules

import React, { useEffect, useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import { ipaddress } from '../App'
import { Context } from '../context/Context_provider'
import axiosInstance from './axiosInstance'

const Addsubjects = ({ status,setCount1,setStatus}) => {

  const {translate_value,addsubjects_layout,setAddsubjects_layout}=useContext(Context)

  const [courses, setCourses] = useState([])
  const [status1, setStatus1] = useState()
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('user'))
  
  useEffect(() => {
    // setStatus1(status)
    fetchSubjects()
  }, [status])

  // --------------------------------------------To fetch all the subjects--------------------------------------------------
  const fetchSubjects=()=>{
    axiosInstance.get(`${ipaddress}/CoursesView/${user.user_id}/`)
    .then((r) => {
      // console.log("Successfully All courses fetched", r.data)
      setCourses(r.data.courses)
    })
    .catch(() => {
      // console.log("All Courses fetching error")
    })
  }


  const handleSelectCourse = (courseId) => {
    if (selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(selectedCourseIds.filter(id => id !== courseId));
    } else {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  }

  const sendSubjects = () => {
    axiosInstance.post(`${ipaddress}/CoursesView/${user.user_id}/`, selectedCourseIds)
    .then((r) => {
      // console.log(selectedCourseIds, r.data)
      setCount1((prev)=>prev+1)
      setSelectedCourseIds([])
      setAddsubjects_layout(false)
    })
  }

  // -------------------------------------Search and take the subjects------------------------------------------------
const[SearchedSubjects,setSearchedSubjects]=useState([])
const[searchvalue,setSearchvalue]=useState("")
const searchSubject=(value)=>{
  setSearchvalue(value)
  if(value.length>0){
  axiosInstance.get(`${ipaddress}/CoursesSearch/${user.user_id}/${value}/`)
  .then((r)=>{
    // console.log("Searched Subjects Found",r.data)
    setCourses(r.data)
  })
}
else{
  fetchSubjects()
}
}

const[state,setstate]=useState(false)

  return (
    <div id='addsubjectsdiv' className={addsubjects_layout ? 'd-block animate__animated animate__fadeIn' : 'd-none'} style={{ backgroundColor: 'rgb(0, 0, 0,0.3)', position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 6, height: '100%' }}>
      
      <div className={`row m-0 py-4 ${state ? 'd-none':''}`} style={{height:'100vh',backgroundColor:'rgba(0,0,0,0.6)',position:'fixed',width:'100%',zIndex:6}}>
        <div className='bg-white animate__animated animate__zoomInUp mx-auto col-md-8 rounded shadow d-flex flex-column align-items-center'>
            <img src={require('../img/landing_page/Group 448.png')} width={330} alt="" />
            <p className='page4-head fs-1' style={{color:'#5D5FE3'}}>Welcome to the Student Community!</p>
            <p className='m-0 fw-medium page4-para' style={{fontSize:'17px'}}>Expand your study network. Connect with peers across cities and exchange diverse insights</p>
            <p className=' fw-medium page4-para' style={{fontSize:'17px'}}>Speak freely, share boldly. Post anonymously and engage in genuine peer-to-peer learning</p>
           <p className='text-decoration-underline mt-4' onClick={()=>{
            setstate(true)
           }} style={{color:'#ff845d',cursor:'pointer'}}>Next Step</p>
        </div>
    </div>

      <div className={`container py-4 bg-light px-2 px-lg-5 ${state ? '':'d-none'}`} style={{ height: '100vh', overflowY: 'scroll' }}>
        <div className="d-flex justify-content-between">
          <div className='d-flex '>
            <svg onClick={(e) => {
              e.preventDefault()
      setAddsubjects_layout(false)
      setstate(false)
            }} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
            </svg>
            <h4 className='fw-bold ms-4' style={{fontSize:'32px',letterSpacing:'0.64px'}}>Select Modules</h4>
          </div>
          <a href="" style={{ color: '#FF845D', fontWeight: 500 }} onClick={(e) => {
            e.preventDefault()
      setAddsubjects_layout(false)
      setstate(false)
          }}>Skip, I will do it later</a>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div className="input-group bg-white border rounded py-2 px-2 modules-search">
            <span className="input-group-text border-0 bg-transparent" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M20.2965 20.9936L13.774 14.4712C13.2532 14.9145 12.6542 15.2577 11.9771 15.5008C11.3001 15.7439 10.6196 15.8654 9.93586 15.8654C8.26746 15.8654 6.85544 15.2879 5.6998 14.1329C4.54414 12.9778 3.96631 11.5666 3.96631 9.89908C3.96631 8.23158 4.54382 6.81924 5.69883 5.66205C6.85385 4.50486 8.26511 3.92627 9.93261 3.92627C11.6001 3.92627 13.0125 4.50409 14.1696 5.65973C15.3268 6.81538 15.9054 8.22741 15.9054 9.89583C15.9054 10.6196 15.7772 11.3201 15.5208 11.9972C15.2644 12.6743 14.9279 13.2532 14.5112 13.734L21.0336 20.2564L20.2965 20.9936ZM9.93586 14.8237C11.3181 14.8237 12.485 14.348 13.4365 13.3964C14.388 12.4449 14.8638 11.278 14.8638 9.89583C14.8638 8.51362 14.388 7.34676 13.4365 6.39523C12.485 5.4437 11.3181 4.96794 9.93586 4.96794C8.55366 4.96794 7.38679 5.4437 6.43527 6.39523C5.48376 7.34676 5.008 8.51362 5.008 9.89583C5.008 11.278 5.48376 12.4449 6.43527 13.3964C7.38679 14.348 8.55366 14.8237 9.93586 14.8237Z" fill="#8E9696"/>
</svg></span>
            <input onChange={(e)=>{
              searchSubject(e.target.value)
            }} type="text" className="form-control bg-transparent border-0" placeholder="Search and select your Modules" aria-label="Username" aria-describedby="basic-addon1" />
          </div>
          <button className='btn text-white px-2 px-lg-5' style={{ color: '#FF845D', backgroundColor: '#5D5FE3' }} onClick={sendSubjects}>Continue</button>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button className='btn d-flex align-items-center fw-medium addsubjects-btns py-2 py-md-3 px-2 px-md-5' style={{ fontSize: '18px', backgroundColor: '#F3F0FF', color: '#5D5FE3', border: '1px solid #BBBAF5',letterSpacing:'0.36px',lineHeight:'normal'}}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="27" viewBox="0 0 25 27" fill="none">
  <path d="M4.47908 21.7917V10.125H5.93742V21.7917H4.47908ZM11.7708 21.7917V10.125H13.2291V21.7917H11.7708ZM0.160156 26.1667V24.7083H24.8397V26.1667H0.160156ZM19.0624 21.7917V10.125H20.5208V21.7917H19.0624ZM0.160156 7.20834V5.97437L12.4999 0.0849304L24.8397 5.97437V7.20834H0.160156ZM4.01355 5.75001H20.9863L12.4999 1.73959L4.01355 5.75001Z" fill="#5D5FE3"/>
</svg> <span className='ms-2'>University : {user.university_name}</span></button>
          <button className='btn d-flex align-items-center fw-medium py-2 py-md-3 addsubjects-btns px-2 px-md-5' style={{ fontSize: '18px', backgroundColor: '#F3F0FF', color: '#5D5FE3', border: '1px solid #BBBAF5',letterSpacing:'0.36px',lineHeight:'normal'}}><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
  <path d="M17.5002 27.2597L8.75016 22.5032V15.4359L4.4873 13.125L17.5002 6.05771L30.513 13.125V22.4359H29.0546V13.9439L26.2502 15.4359V22.5032L17.5002 27.2597ZM17.5002 18.5208L27.4617 13.125L17.5002 7.72918L7.53861 13.125L17.5002 18.5208ZM17.5002 25.5966L24.7918 21.6591V16.238L17.5002 20.1871L10.2085 16.238V21.6591L17.5002 25.5966Z" fill="#5D5FE3"/>
</svg> <span className='ms-2'>Course : {user.program_name}</span></button>
        </div>

<h6 className={`fs-5 text-secondary text-center py-4 ${courses.length>0 ? 'd-none':''}`}>No Subjects available...</h6>
        <div className={`row m-0 mt-4 pt-3 ${courses.length>0 ? '':'d-none'}`}>
          {courses.map((x) => {
            const isSelected = selectedCourseIds.includes(x.course_id);
            return (
              <div className='col-md-4 py-2' key={x.course_id}>
                <div className={`bg-white px-4 py-4 shadow-sm border rounded ${isSelected ? 'selected-course' : ''}`}>
                  <p className='p-tag'><span className='border rounded-circle' style={{backgroundColor:isSelected ? '#05AF75':''}}><svg xmlns="http://www.w3.org/2000/svg" width="19" height="15" fill="currentColor" className={`bi bi-check2 ${isSelected ? 'text-warning' : ''}`} viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                  </svg></span> <span className='ms-2'>{x.course_name}</span></p>

                  <button className='btn fw-medium border px-5 w-100 mt-2 py-2' style={{ color:isSelected ? '#fff':'#2A3941',backgroundColor:isSelected ? '#5D5FE3':'' }} onClick={() => handleSelectCourse(x.course_id)}>
                    {isSelected ? 'Selected' : 'Select Module'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Addsubjects;
